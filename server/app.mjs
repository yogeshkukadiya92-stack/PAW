import { ACCESS, accessFor } from '../shared/access.mjs';
import { validateCompletionChanges, validateMaintenanceChanges } from './workshop.mjs';
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdirSync, chmodSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SESSION_MS, IDLE_MS, ROLES, digest, failure, checkUsername, hashPassword, verifyPassword, publicUser, isAdmin, visibleState, authorizeChange, validateState } from './security.mjs';
import { normalizeReports, validateOverrides } from './assessment-config.mjs';
const emptyState = () => ({ batches: [], members: [], leads: [], participants: [] });
const cookieName = 'paw_session';
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};

export async function createApp({ dbPath = process.env.PAW_DATABASE_PATH || resolve('data/paw.sqlite'), production = process.env.NODE_ENV === 'production', appOrigin = process.env.PAW_APP_ORIGIN, setupToken = process.env.PAW_SETUP_TOKEN || '', adminEmail = process.env.PAW_ADMIN_EMAIL || '', adminPassword = process.env.PAW_ADMIN_PASSWORD || '', adminName = process.env.PAW_ADMIN_NAME || 'Main Admin', distPath = resolve('dist') } = {}) {
  if (dbPath !== ':memory:') { mkdirSync(dirname(dbPath), { recursive: true, mode: 0o700 }); }
  const db = new DatabaseSync(dbPath);
  if (dbPath !== ':memory:') chmodSync(dbPath, 0o600);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      role TEXT NOT NULL, member_id TEXT UNIQUE, participant_id TEXT UNIQUE, password_hash TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1, must_change INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires INTEGER NOT NULL, last_seen INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS question_bank (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, user_id TEXT, action TEXT NOT NULL, created_at TEXT NOT NULL);
  `);
  if(!db.prepare('PRAGMA table_info(users)').all().some(c=>c.name==='permissions'))db.exec('ALTER TABLE users ADD COLUMN permissions TEXT');
  db.prepare('INSERT OR IGNORE INTO app_state VALUES (1, 0, ?)').run(JSON.stringify(emptyState()));
  db.prepare('INSERT OR IGNORE INTO question_bank VALUES(1,0,?)').run('{}');
  const readBank = () => { const row=db.prepare('SELECT revision,value FROM question_bank WHERE id=1').get();return {revision:Number(row.revision),overrides:JSON.parse(row.value)}; };
  const dummyHash = await hashPassword(randomBytes(32).toString('hex'));
  const limits = new Map();
  const now = () => Date.now();
  const countUsers = () => Number(db.prepare('SELECT COUNT(*) AS n FROM users').get().n);
  const readState = () => {
    const row = db.prepare('SELECT revision, value FROM app_state WHERE id=1').get();
    return { revision: Number(row.revision), data: JSON.parse(row.value) };
  };
  const writeState = (data, revision) => db.prepare('UPDATE app_state SET value=?, revision=? WHERE id=1').run(JSON.stringify(data), revision);
  const audit = (id, action) => db.prepare('INSERT INTO audit(user_id, action, created_at) VALUES(?,?,?)').run(id || null, action, new Date().toISOString());
  const reply = (res, status, payload) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(payload)); };
  const tokenFrom = req => (req.headers.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  const setSession = (res, userId) => {
    const token = randomBytes(32).toString('base64url');
    const time = now();
    db.prepare('DELETE FROM sessions WHERE expires < ? OR last_seen < ?').run(time, time - IDLE_MS);
    db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(digest(token),userId,time + SESSION_MS,time);
    res.setHeader('Set-Cookie', `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MS/1000}${production ? '; Secure' : ''}`);
  };
  const expireCookie = res => res.setHeader('Set-Cookie',`${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${production ? '; Secure' : ''}`);
  const actor = req => {
    const token = tokenFrom(req);
    if (!token || token.length > 100) return null;
    const row = db.prepare('SELECT u.*, s.expires, s.last_seen FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=?').get(digest(token));
    if (!row || !row.active || Number(row.expires) <= now() || Number(row.last_seen) <= now() - IDLE_MS) return null;
    db.prepare('UPDATE sessions SET last_seen=? WHERE hash=?').run(now(),digest(token));
    return publicUser(row);
  };
  const assertOrigin = req => {
    const origin = req.headers.origin;
    if (!origin || origin !== (appOrigin || `${production ? 'https' : 'http'}://${req.headers.host}`)) throw failure(403, 'This request came from an unapproved origin.');
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) throw failure(415, 'Send JSON requests.');
  };
  const localSetup = req => {
    if (production) return false;
    const remote = req.socket.remoteAddress;
    const loopback = ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote);
    const peer = loopback ? String(req.headers['x-paw-dev-peer'] || remote) : remote;
    const host = (req.headers.host || '').split(':')[0];
    return ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(peer) && ['localhost','127.0.0.1','['].includes(host);
  };
  const verifySetup = req => {
    if (countUsers()) throw failure(409, 'The PAW Head account is already configured. Please sign in.');
    if (!setupToken && localSetup(req)) return;
    const supplied = String(req.headers['x-paw-setup-token'] || '');
    if (!setupToken || !timingSafeEqual(Buffer.from(digest(supplied)),Buffer.from(digest(setupToken)))) throw failure(403,'Enter the setup key configured by your administrator.');
  };
  const body = async req => {
    let length = 0; const buffers = [];
    for await (const chunk of req) {
      length += chunk.length;
      if (length > 8 * 1024 * 1024) throw failure(413,'This request is too large.');
      buffers.push(chunk);
    }
    try { const value = JSON.parse(Buffer.concat(buffers).toString()); if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(); return value; }
    catch { throw failure(400,'Invalid JSON request.'); }
  };
  const throttle = key => {
    const time = now();
    if (limits.size > 10000) for (const [k,v] of limits) if (v.until < time) limits.delete(k);
    const record = limits.get(key);
    if (record && record.until > time && record.count >= 8) throw failure(429,'Too many attempts. Try again in 15 minutes.');
    if (!record || record.until <= time) limits.set(key,{count:1,until:time+15*60*1000}); else record.count++;
  };
  const insertUser = (details, passwordHash) => {
    const id = randomUUID();
    try { db.prepare('INSERT INTO users (id,username,name,role,member_id,participant_id,password_hash,active,must_change,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,details.username,details.name,details.role,details.memberId || null,details.participantId || null,passwordHash,1,details.mustChangePassword ? 1 : 0,new Date().toISOString()); }
    catch (e) { if (String(e.message).includes('UNIQUE')) throw failure(409,'This login ID or person already has an account.'); throw e; }
    return publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(id));
  };
  // Environment credentials bootstrap an empty workspace only; never reset an existing account.
  if (!countUsers() && (adminEmail || adminPassword)) {
    try {
      if (!adminEmail || !adminPassword) throw new Error('Set both PAW_ADMIN_EMAIL and PAW_ADMIN_PASSWORD.');
      const username = checkUsername(adminEmail);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) throw new Error('PAW_ADMIN_EMAIL must be a valid email address.');
      const name = String(adminName).trim();
      if (!name || name.length > 120) throw new Error('PAW_ADMIN_NAME must contain 1 to 120 characters.');
      const hash = await hashPassword(adminPassword);
      db.exec('BEGIN IMMEDIATE');
      try {
        if (!countUsers()) {
          const memberId = `member-${randomUUID()}`;
          const user = insertUser({username,name,role:'PAW_HEAD',memberId},hash);
          const {data,revision} = readState();
          data.members.push({id:memberId,name,phone:'',email:username,role:'PAW_HEAD',team:'LEADERSHIP',isAvailable:true});
          writeState(data,revision+1); audit(user.id,'owner_environment_setup');
        }
        db.exec('COMMIT');
      } catch(error) { db.exec('ROLLBACK'); throw error; }
    } catch(error) { db.close(); throw error; }
  }
  const server = createServer(async (req,res) => {
    res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('X-Frame-Options','DENY'); res.setHeader('Referrer-Policy','same-origin');
    if (production) {
      res.setHeader('Strict-Transport-Security','max-age=31536000');
      res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
    }
    try {
      const path = new URL(req.url,'http://localhost').pathname;
      const method = req.method;
      if (path.startsWith('/api/')) {
        if (method !== 'GET') assertOrigin(req);
        if (path === '/api/question-bank' && method === 'GET') return reply(res,200,readBank());
        if (path === '/api/auth/status' && method === 'GET') return reply(res,200,{ setupRequired: countUsers() === 0, setupKeyRequired: !localSetup(req) || Boolean(setupToken), user: actor(req) });
        if (path === '/api/auth/setup' && method === 'POST') {
          throttle(`setup:${req.socket.remoteAddress}`); verifySetup(req);
          const input = await body(req); const username = checkUsername(input.username);
          const name = typeof input.name === 'string' ? input.name.trim() : '';
          if (!name || name.length > 120) throw failure(400,'Enter your full name.');
          const hash = await hashPassword(input.password);
          // Check again after password hashing to prevent parallel first-account creation.
          verifySetup(req);
          const memberId = `member-${randomUUID()}`;
          db.exec('BEGIN IMMEDIATE');
          try {
            const user = insertUser({username,name,role:'PAW_HEAD',memberId},hash);
            const {data,revision} = readState();
            data.members.push({id:memberId,name,phone:'',email:'',role:'PAW_HEAD',team:'LEADERSHIP',isAvailable:true});
            writeState(data,revision+1); audit(user.id,'owner_setup'); db.exec('COMMIT'); setSession(res,user.id);
            return reply(res,201,{user});
          } catch (e) { db.exec('ROLLBACK'); throw e; }
        }
        if (path === '/api/auth/signup') throw failure(403,'Public sign up is disabled. Ask your administrator to create your staff account.');
        if (path === '/api/auth/login' && method === 'POST') {
          const input = await body(req); const username = typeof input.username === 'string' ? input.username.trim().toLowerCase().slice(0,80) : '';
          const key = `login:${req.socket.remoteAddress}:${digest(username)}`;
          throttle(key); throttle(`ip:${req.socket.remoteAddress}`);
          const row = db.prepare('SELECT * FROM users WHERE username=?').get(username);
          const valid = await verifyPassword(input.password,row?.password_hash || dummyHash);
          const latest = row ? db.prepare('SELECT * FROM users WHERE id=?').get(row.id) : null;
          if (!valid || !latest?.active || latest.password_hash !== row.password_hash) { audit(null,'login_failed'); throw failure(401,'Login ID or password is incorrect.'); }
          limits.delete(key); limits.delete(`ip:${req.socket.remoteAddress}`);
          const previous = tokenFrom(req); if (previous) db.prepare('DELETE FROM sessions WHERE hash=?').run(digest(previous));
          setSession(res,row.id); audit(row.id,'login'); return reply(res,200,{user:publicUser(row)});
        }
        const user = actor(req);
        if (!user) { expireCookie(res); throw failure(401,'Please sign in to continue.'); }
        if (path === '/api/auth/logout' && method === 'POST') {
          const token = tokenFrom(req); if (token) db.prepare('DELETE FROM sessions WHERE hash=?').run(digest(token));
          expireCookie(res); audit(user.id,'logout'); return reply(res,200,{ok:true});
        }
        if (path === '/api/auth/password' && method === 'POST') {
          throttle(`password:${user.id}`);
          const input = await body(req); const row = db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
          if (!await verifyPassword(input.currentPassword,row.password_hash)) throw failure(400,'Your current password is incorrect.');
          if (input.currentPassword === input.newPassword) throw failure(400,'Choose a different password.');
          const hash = await hashPassword(input.newPassword);
          const latest = db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
          if (!actor(req) || latest.password_hash !== row.password_hash) throw failure(409,'Your account changed. Sign in again before changing your password.');
          db.prepare('UPDATE users SET password_hash=?, must_change=0 WHERE id=?').run(hash,user.id);
          db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id); setSession(res,user.id); audit(user.id,'password_changed');
          return reply(res,200,{user:publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(user.id))});
        }
        if (user.mustChangePassword) throw failure(403,'Change your temporary password before continuing.');
        if (path === '/api/question-bank' && method === 'PUT') {
          if (!isAdmin(user)) throw failure(403,'Only the Main Admin can edit the question bank.');
          const input=await body(req);const bank=readBank();
          if(input.revision!==bank.revision) throw failure(409,'The question bank changed. Reload before editing again.');
          validateOverrides(input.overrides);
          db.prepare('UPDATE question_bank SET revision=?,value=? WHERE id=1').run(bank.revision+1,JSON.stringify(input.overrides));
          audit(user.id,'question_bank_updated');return reply(res,200,readBank());
        }
        if (path === '/api/accounts' && method === 'GET') {
          if (!isAdmin(user)) throw failure(403,'Only the PAW Head can manage logins.');
          return reply(res,200,{accounts:db.prepare('SELECT * FROM users ORDER BY created_at DESC').all().map(publicUser)});
        }
        if (path === '/api/accounts' && method === 'POST') {
          if (!isAdmin(user)) throw failure(403,'Only the PAW Head can create logins.');
          const input = await body(req); const username = checkUsername(input.username);
          if (!ROLES.includes(input.role)) throw failure(400,'Choose a valid role.');
          const state = readState().data;
          let person = input.role === 'PARTICIPANT' ? state.participants.find(p => p.id === input.participantId)
            : state.members.find(m => m.id === input.memberId && m.role === input.role);
          const createMember=!person&&input.role!=='PARTICIPANT'&&typeof input.name==='string'&&input.name.trim();
          if(createMember){
            if(input.name.trim().length>120)throw failure(400,'Name must be at most 120 characters.');
            person={id:`member-${randomUUID()}`,name:input.name.trim(),phone:'',email:'',role:input.role,team:input.role==='CALLING_MEMBER'?'CALLING':input.role==='WELCOME_MEMBER'?'WELCOME_FOLLOWUP':'LEADERSHIP',isAvailable:true,...(input.role==='CALLING_MEMBER'?{callingCapacity:25}:{})};
          }
          if (!person) throw failure(400,'Select an existing person with the matching role.');
          const hash = await hashPassword(input.password);
          // Recheck the actor and linked record after asynchronous password hashing.
          if (!actor(req) || !isAdmin(actor(req))) throw failure(403,'Your permissions have changed.');
          const fresh = readState().data;
          if (!createMember && (input.role === 'PARTICIPANT' ? !fresh.participants.some(p => p.id === input.participantId) : !fresh.members.some(m => m.id === input.memberId && m.role === input.role))) throw failure(409,'This person changed while creating the login.');
          db.exec('BEGIN IMMEDIATE');
          try {
          if(createMember){const snapshot=readState();snapshot.data.members.push(person);validateState(snapshot.data);writeState(snapshot.data,snapshot.revision+1);}
          const account = insertUser({username,name:person.fullName || person.name,role:input.role,memberId:input.role === 'PARTICIPANT' ? null : person.id,participantId:input.role === 'PARTICIPANT' ? person.id : null,mustChangePassword:true},hash);
          audit(user.id,'account_created');db.exec('COMMIT'); return reply(res,201,{account});
          }catch(error){db.exec('ROLLBACK');throw error;}
        }
        const accountMatch = path.match(/^\/api\/accounts\/([^/]+)$/);
        if (accountMatch && method === 'PATCH') {
          if (!isAdmin(user)) throw failure(403,'Only the PAW Head can manage logins.');
          const id = accountMatch[1]; if (id === user.id) throw failure(400,'Use Change password for your own account.');
          const target = db.prepare('SELECT * FROM users WHERE id=?').get(id); if (!target) throw failure(404,'Account not found.');
          const input = await body(req);
          if(input.permissions!==undefined&&(!Array.isArray(input.permissions)||input.permissions.some(p=>!Object.hasOwn(ACCESS,p))||target.role==='PAW_HEAD'))throw failure(400,'Choose valid staff permissions. Main Admin always has full access.');
          if (typeof input.active !== 'boolean' && !input.password && !input.participantId && input.permissions===undefined) throw failure(400,'Choose an account action.');
          const hash = input.password ? await hashPassword(input.password) : null;
          if (!actor(req) || !isAdmin(actor(req))) throw failure(403,'Your permissions have changed.');
          db.exec('BEGIN IMMEDIATE');
          try {
            if (input.participantId) {
              if(target.role!=='PARTICIPANT'||target.participant_id)throw failure(400,'Only an unassigned participant account can be linked.');
              const person=readState().data.participants.find(p=>p.id===input.participantId);
              if(!person)throw failure(400,'Choose an existing participant.');
              if(db.prepare('SELECT id FROM users WHERE participant_id=?').get(person.id))throw failure(409,'This participant already has an account.');
              db.prepare('UPDATE users SET participant_id=?, name=? WHERE id=?').run(person.id,person.fullName,id);
              audit(user.id,'signup_participant_linked');
            }
            if(input.permissions!==undefined)db.prepare('UPDATE users SET permissions=? WHERE id=?').run(JSON.stringify([...new Set(input.permissions)]),id);
            if (typeof input.active === 'boolean') db.prepare('UPDATE users SET active=? WHERE id=?').run(input.active?1:0,id);
            if (hash) db.prepare('UPDATE users SET password_hash=?, must_change=1 WHERE id=?').run(hash,id);
            db.prepare('DELETE FROM sessions WHERE user_id=?').run(id); audit(user.id,hash ? 'password_reset' : 'account_status_changed'); db.exec('COMMIT');
          } catch(e) {db.exec('ROLLBACK');throw e;}
          return reply(res,200,{account:publicUser(db.prepare('SELECT * FROM users WHERE id=?').get(id))});
        }
        if (path === '/api/state' && !accessFor(user).includes('workspace'))throw failure(403,'Workspace access is disabled. Contact your administrator.');
        if (path === '/api/state' && method === 'GET') {
          const snapshot = readState(); return reply(res,200,{revision:snapshot.revision,data:visibleState(snapshot.data,user)});
        }
        if (path === '/api/state' && method === 'PATCH') {
          const input = await body(req); const {data,revision} = readState();
          if (!Number.isInteger(input.revision)) throw failure(400,'Invalid data revision.');
          if (!input.changes || typeof input.changes !== 'object') throw failure(400,'No changes provided.');
          const next = structuredClone(data);
          for (const [collection,delta] of Object.entries(input.changes)) {
            if (!Object.hasOwn(next,collection) || !Array.isArray(delta?.upsert) || !Array.isArray(delta?.remove)) throw failure(400,'Invalid changes.');
            const changedIds = [...delta.upsert.map(row=>row?.id), ...delta.remove];
            if (delta.before && typeof delta.before === 'object' && !Array.isArray(delta.before)) {
              for (const id of changedIds) {
                const latest = data[collection].find(row=>row.id===id) || null;
                if (!Object.hasOwn(delta.before,id) || JSON.stringify(delta.before[id]) !== JSON.stringify(latest)) throw failure(409,'This record was updated by another person. Reload the latest data and try again.');
              }
            } else if (input.revision !== revision) throw failure(409,'Someone else updated these records. Reload the latest data and try again.');
            const touched = new Set();
            for (const row of delta.upsert) {
              if (!row || typeof row.id !== 'string' || touched.has(row.id)) throw failure(400,'Invalid record ID.');
              touched.add(row.id);
              const old = data[collection].find(r => r.id === row.id);
              authorizeChange(collection,old,row,user,data);
              if (collection === 'participants' && !old && user.role === 'CALLING_MEMBER' && !data.leads.some(l => l.assignedMemberId === user.memberId && l.pawBatchId === row.pawBatchId && l.phone === row.phone)) throw failure(403,'Register only your own calling leads.');
              const index = next[collection].findIndex(r => r.id === row.id);
              if (index < 0) next[collection].unshift(row); else next[collection][index]=row;
            }
            for (const id of delta.remove) {
              const old = data[collection].find(r => r.id === id); if (!old) continue;
              authorizeChange(collection,old,null,user,data); next[collection] = next[collection].filter(r => r.id !== id);
            }
          }
          normalizeReports(next,data);
          validateState(next);
          validateCompletionChanges(next,data);
          validateMaintenanceChanges(next,data);
          // Linked accounts must not be orphaned or silently gain a different role.
          for (const account of db.prepare('SELECT * FROM users').all()) {
            if (account.member_id && !next.members.some(m => m.id === account.member_id && m.role === account.role)) throw failure(400,'This member has a linked login. Keep the member and their role; disable the login if access is no longer needed.');
            if (account.participant_id && !next.participants.some(p => p.id === account.participant_id)) throw failure(400,'This participant has a login and cannot be removed.');
          }
          writeState(next,revision+1); audit(user.id,'records_updated'); return reply(res,200,{revision:revision+1,data:visibleState(next,user)});
        }
        throw failure(404,'Endpoint not found.');
      }
      if (!['GET','HEAD'].includes(method)) throw failure(405,'Method not allowed.');
      let requested;
      try { requested = resolve(distPath, `.${decodeURIComponent(path)}`); } catch { throw failure(400,'Invalid path.'); }
      if (!requested.startsWith(distPath + sep) && requested !== distPath) throw failure(403,'Access denied.');
      if (!existsSync(requested) || !statSync(requested).isFile()) requested = resolve(distPath,'index.html');
      if (!existsSync(requested)) throw failure(404,'Build the app first, or open the development server.');
      res.setHeader('Cache-Control',path.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache');
      res.setHeader('Content-Type',types[extname(requested)] || 'application/octet-stream');
      res.end(method === 'HEAD' ? undefined : readFileSync(requested));
    } catch (error) {
      if (!error.status) console.error('Server request failed:',error.message);
      if (!res.headersSent) reply(res,error.status || 500,{error:error.status ? error.message : 'Unable to complete this request. Try again.'}); else res.end();
    }
  });
  server.requestTimeout=15000; server.headersTimeout=10000;
  server.on('close',()=>db.close());
  return server;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server=await createApp(); const port=Number(process.env.PORT || 3001);
  server.listen(port,process.env.HOST || '127.0.0.1',()=>console.log(`PAW server ready on port ${port}`));
}
