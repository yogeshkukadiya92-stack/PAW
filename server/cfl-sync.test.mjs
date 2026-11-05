import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mergeCflFeed } from './cfl-sync.mjs';
import { createApp } from './app.mjs';
const empty=()=>({batches:[],participants:[],members:[],leads:[]});
const feed=()=>({version:1,workshops:[{id:'paw-1',title:'PAW November',type:'Online'}],registrations:[{id:'r1',workshopId:'paw-1',fullName:'Synthetic Person',mobile:'+91 99999 99999',registrationStatus:'confirmed'}]});
test('CFL creates an unscheduled draft and imports a participant idempotently',()=>{
 const first=mergeCflFeed(empty(),feed());assert.equal(first.result.participantsCreated,1);assert.equal(first.data.batches[0].startDate,'');
 const second=mergeCflFeed(first.data,feed());assert.deepEqual(second.data,first.data);assert.equal(second.result.participantsCreated,0);
});
test('CFL matches existing national phones, preserves assessment and binds external identity after phone changes',()=>{
 const first=mergeCflFeed(empty(),feed()).data;first.participants[0].cflRegistrationId=undefined;first.participants[0].cflRegistrationIds=[];first.participants[0].id='manual';first.participants[0].assessmentAnswers={1:'1'};
 const next=mergeCflFeed(first,feed());assert.equal(next.data.participants.length,1);assert.deepEqual(next.data.participants[0].assessmentAnswers,{1:'1'});
 const changed=feed();changed.registrations[0].mobile='9888888888';assert.equal(mergeCflFeed(next.data,changed).data.participants.length,1);
});
test('CFL separates workshops, skips malformed and orphan registrations, and rejects mapping changes after enrollment',()=>{
 const f=feed();f.workshops.push({id:'paw-2',title:'PAW December'});f.registrations.push({...f.registrations[0],id:'r2',workshopId:'paw-2'},{id:'bad',workshopId:'missing'});
 const first=mergeCflFeed(empty(),f);assert.equal(first.data.participants.length,2);assert.equal(first.result.skipped,1);
 assert.throws(()=>mergeCflFeed(first.data,f,{'paw-1':first.data.batches[1].id}),/already linked/);
});
test('waiting registrations remain provisional, team allocation balances available welcome members',()=>{
 const initial=empty();initial.members=[1,2].map(i=>({id:`welcome-${i}`,name:`Welcome ${i}`,phone:'',email:'',role:'WELCOME_MEMBER',team:'WELCOME_FOLLOWUP',isAvailable:true}));
 const f=feed();f.registrations[0].registrationStatus='waiting';f.registrations.push({...f.registrations[0],id:'r2',mobile:'9888888888'});
 const result=mergeCflFeed(initial,f);assert.equal(result.data.participants[0].registrationStatus,'Provisional');assert.notEqual(result.data.participants[0].assignedWelcomeIclMemberId,result.data.participants[1].assignedWelcomeIclMemberId);
});
test('CFL API is admin-only, pulls with server credentials, persists successful backfill and retains data on upstream failure',async()=>{
 let failing=false,calls=0;
 const server=await createApp({dbPath:':memory:',cflBaseUrl:'https://cfl.example',cflToken:'synthetic-secret',cflIntervalMs:3600000,cflFetch:async(url,options)=>{calls++;assert.equal(url.href,'https://cfl.example/api/v1/paw');assert.equal(options.headers.Authorization,'Bearer synthetic-secret');return failing?new Response('{}',{status:503}):new Response(JSON.stringify(feed()));}});
 server.listen(0,'127.0.0.1');await once(server,'listening');const base=`http://127.0.0.1:${server.address().port}`;let cookie='';
 const request=async(path,method='GET',body)=>{const r=await fetch(base+path,{method,headers:{Origin:base,'Content-Type':'application/json',Cookie:cookie},...(body?{body:JSON.stringify(body)}:{})});return r;};
 try{
  assert.equal((await request('/api/integrations/cfl')).status,401);
  const setup=await request('/api/auth/setup','POST',{username:'owner',name:'Synthetic Admin',password:'Synthetic test password 1234'});cookie=setup.headers.get('set-cookie').split(';')[0];
  const synced=await request('/api/integrations/cfl','POST',{});assert.equal(synced.status,200);const status=await synced.json();assert.ok(status.lastSuccess);assert.ok(!JSON.stringify(status).includes('synthetic-secret'));
  const before=await (await request('/api/state')).json();assert.equal(before.data.participants.length,1);
  failing=true;assert.equal((await request('/api/integrations/cfl','POST',{})).status,502);
  const after=await (await request('/api/state')).json();assert.deepEqual(after,before);assert.ok(calls>=2);
 }finally{server.close();await once(server,'close');}
});
