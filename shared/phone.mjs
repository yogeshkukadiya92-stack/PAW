export function whatsappPhone(value){
 const raw=String(value||'').trim();let digits=raw.replace(/\D/g,'');
 if(digits.startsWith('00'))digits=digits.slice(2);
 if(!raw.startsWith('+')&&/^0[6-9]\d{9}$/.test(digits))digits=digits.slice(1);
 if(!raw.startsWith('+')&&/^[6-9]\d{9}$/.test(digits))digits='91'+digits;
 return digits;
}
