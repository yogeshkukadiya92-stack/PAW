process.env.NODE_ENV='production';
process.env.HOST ||= '0.0.0.0';
const { createApp }=await import('../server/app.mjs');
const server=await createApp();
server.listen(Number(process.env.PORT||3001),process.env.HOST,()=>console.log('PAW application is ready.'));
