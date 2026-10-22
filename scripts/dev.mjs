import { spawn } from 'node:child_process';
const children = [
  spawn(process.execPath, ['--watch', 'server/app.mjs'], {stdio:'inherit', env:{...process.env,NODE_ENV:'development'}}),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', ...process.argv.slice(2)], {stdio:'inherit'}),
];
let stopping=false;
function stop(code=0) { if(stopping)return;stopping=true;for(const child of children) child.kill('SIGTERM');setTimeout(()=>process.exit(code),300).unref(); }
for(const child of children) {child.on('error',()=>stop(1));child.on('exit',code=>{if(!stopping)stop(code||0);});}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
