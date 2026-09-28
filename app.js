function h(s){return s.replace(/#T#/g,"\x3c")}
const KNOWN=[{mint:"DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",name:"Bonk",sym:"BONK"},{mint:"EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",name:"dogwifhat",sym:"WIF"},{mint:"2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",name:"Pudgy Penguins",sym:"PENGU"},{mint:"7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",name:"Popcat",sym:"POPCAT"},{mint:"MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",name:"cat in a dogs world",sym:"MEW"},{mint:"ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82",name:"BOOK OF MEME",sym:"BOME"},{mint:"JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",name:"Jupiter",sym:"JUP"},{mint:"6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",name:"OFFICIAL TRUMP",sym:"TRUMP"},{mint:"So11111111111111111111111111111111111111112",name:"Solana",sym:"SOL"}];
const db={get:(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const users=()=>{const u=db.get("alfa_users",[]);if(!u.length){u.push({user:"trader",pass:"desk2026"});db.set("alfa_users",u)}return u};
const session=()=>db.get("alfa_session",null);
const book=()=>db.get("alfa_book_"+(session()?.user||"x"),null)||{capital:10000,cash:10000,equity:10000,peak:10000,pos:[],trd:[],audit:[],bot:{on:false,runs:0,msg:"apagado"}};
const save=b=>db.set("alfa_book_"+session().user,b);
const money=n=>Number(n||0).toLocaleString("es-ES",{style:"currency",currency:"USD",maximumFractionDigits:2});
const compact=n=>{n=+n||0;return n>=1e6?"$"+(n/1e6).toFixed(1)+"M":n>=1e3?"$"+(n/1e3).toFixed(0)+"k":money(n)};
const pct=n=>n==null||Number.isNaN(+n)?"-":((+n>=0?"+":"")+(+n).toFixed(1)+"%");
const cls=n=>n==null?"":(+n>=0?"up":"down");
const ticket=b=>Math.max(8,Math.min(80,b.capital*0.008));
function pickSol(pairs){return (pairs||[]).filter(p=>p.chainId==="solana"&&+p.priceUsd>0).sort((a,b)=>(b.liquidity?.usd||0)-(a.liquidity?.usd||0))[0]}
function auditPair(p,hint){
const liq=p.liquidity?.usd||0,vol=p.volume?.h24||0,chg=p.priceChange?.h24,mcap=p.marketCap||p.fdv||0,age=p.pairCreatedAt?Math.max(0,(Date.now()-p.pairCreatedAt)/36e5):null,flags=[];
if(liq<25000)flags.push({t:"liq muy baja",k:"bad"});else if(liq<120000)flags.push({t:"liq media",k:"warn"});else flags.push({t:"liq ok",k:"ok"});
if(vol<15000)flags.push({t:"vol flojo",k:"warn"});
if(chg!=null&&Math.abs(chg)>45)flags.push({t:"muy volatil",k:"warn"});
if(age!=null&&age<6)flags.push({t:"par nuevo",k:"warn"});
let score=38+Math.min(28,Math.log10(Math.max(liq,1))*5.5)+Math.min(18,Math.log10(Math.max(vol,1))*3.6);
if(liq<25000)score-=28;if(chg!=null&&chg<-30)score-=12;
score=Math.max(1,Math.min(99,Math.round(score)));
return {mint:hint?.mint||p.baseToken?.address,name:hint?.name||p.baseToken?.name||p.baseToken?.symbol,sym:hint?.sym||p.baseToken?.symbol,price:+p.priceUsd,liq,vol,chg,mcap,flags,score};
}
async function studySolana(){
const out=[],seen=new Set();
const add=a=>{if(a&&a.mint&&!seen.has(a.mint)){seen.add(a.mint);out.push(a)}};
try{const j=await fetch("https://api.dexscreener.com/latest/dex/tokens/"+KNOWN.map(x=>x.mint).join(",")).then(r=>r.json());
for(const hint of KNOWN){const pair=pickSol((j.pairs||[]).filter(p=>p.baseToken&&(p.baseToken.address===hint.mint||(p.quoteToken&&p.quoteToken.address===hint.mint))));if(pair)add(auditPair(pair,hint))}
}catch(e){}
try{const boosts=await fetch("https://api.dexscreener.com/token-boosts/latest/v1").then(r=>r.json());
for(const b of (Array.isArray(boosts)?boosts:[]).filter(x=>x.chainId==="solana").slice(0,8)){
if(seen.has(b.tokenAddress))continue;
try{const j=await fetch("https://api.dexscreener.com/latest/dex/tokens/"+b.tokenAddress).then(r=>r.json());const pair=pickSol(j.pairs);if(!pair)continue;const a=auditPair(pair,{mint:b.tokenAddress,name:pair.baseToken&&pair.baseToken.name,sym:pair.baseToken&&pair.baseToken.symbol});a.flags.push({t:"boost",k:"warn"});add(a)}catch(e){}
}}catch(e){}
out.sort((a,b)=>b.score-a.score);return out.slice(0,18);
}
function mark(b){b.equity=b.cash+b.pos.reduce((s,p)=>s+(p.pnlUsd||0),0);b.peak=Math.max(b.peak||b.capital,b.equity)}
function closePos(b,p,px,why){b.cash+=p.entry*p.qty+(px-p.entry)*p.qty;b.trd.unshift({ts:Date.now(),side:"SELL",id:p.sym,why,px});b.pos=b.pos.filter(x=>x.mint!==p.mint)}
function openPos(b,a,usd){if(b.pos.some(p=>p.mint===a.mint)||b.cash<usd||usd<5||!a.price)return false;b.cash-=usd;b.pos.push({mint:a.mint,name:a.name,sym:a.sym,qty:usd/a.price,entry:a.price,last:a.price,pnl:0,pnlUsd:0});b.trd.unshift({ts:Date.now(),side:"BUY",id:a.sym,why:"Alfa · "+money(usd),px:a.price});return true}
async function cycle(forceBurst){
const b=book();if(!b.bot.on&&!forceBurst){b.bot.msg="apagado";save(b);render();return}
document.getElementById("app").classList.add("busy");
const audit=await studySolana();b.audit=audit;
const byMint=Object.fromEntries(audit.map(a=>[a.mint,a]));
b.pos.forEach(p=>{const q=byMint[p.mint];if(!q)return;p.last=q.price;p.pnl=((p.last-p.entry)/p.entry)*100;p.pnlUsd=(p.last-p.entry)*p.qty});
b.pos.slice().forEach(p=>{if(p.pnl<=-8)closePos(b,p,p.last,"stop -8%");else if(p.pnl>=12)closePos(b,p,p.last,"take +12%")});
const playable=audit.filter(a=>a.score>=42&&a.liq>=20000&&a.price>0);
const size=ticket(b);let opened=0;const target=forceBurst?5+Math.floor(Math.random()*6):1;
const pool=playable.length?playable:audit.filter(x=>x.price>0);
for(const a of pool){if(opened>=target||b.pos.length>=10)break;const usd=Math.min(size*(0.7+Math.random()*0.6),b.cash*0.1);if(openPos(b,a,usd))opened++}
mark(b);b.bot.runs+=1;b.bot.msg=forceBurst?opened+" compras · "+audit.length+" tokens Solana":"ciclo "+b.bot.runs+" · "+audit.length+" Solana";
save(b);document.getElementById("app").classList.remove("busy");render();
}
const ring=s=>s>=70?"okbg":s>=50?"midbg":"badbg";
const chipk=k=>k==="ok"?"chipok":k==="warn"?"chipwarn":k==="bad"?"chipbad":"";
function render(){
const s=session();
document.getElementById("auth").classList.toggle("hidden",!!s);
document.getElementById("app").classList.toggle("hidden",!s);
if(!s)return;
const b=book();mark(b);
const dd=((b.peak-b.equity)/Math.max(b.peak,1))*100;
document.getElementById("equity").textContent=money(b.equity);
document.getElementById("pnlLine").textContent=b.bot.on?(b.bot.msg+(dd>0.2?" · DD "+pct(-Math.abs(dd)):"")):"Paper · sin dinero real";
document.getElementById("power").checked=!!b.bot.on;
document.getElementById("powerLabel").textContent=b.bot.on?"Alfa encendido":"Alfa apagado";
document.getElementById("powerHint").textContent=b.bot.on?"Revisa cada 10 min":"5-10 compras pequenas al encender";
document.getElementById("cap").value=b.capital;
document.getElementById("ticket").textContent=money(ticket(b));
document.getElementById("cash").textContent=money(b.cash);
document.getElementById("npos").textContent=b.pos.length;
document.getElementById("runs").textContent=b.bot.runs;
document.getElementById("auditMeta").textContent=b.audit.length?b.audit.length+" pares Solana":"Sin datos. Enciende Alfa.";
document.getElementById("auditList").innerHTML=b.audit.length?b.audit.map(a=>h("#T#div class=\"token\">#T#div class=\"ring "+ring(a.score)+"\">"+a.score+"#T#/div>#T#div class=\"meta\">#T#div class=\"name\">"+(a.name||a.sym)+"#T#/div>#T#div class=\"sym\">"+(a.sym||"")+" · "+compact(a.liq)+" liq#T#/div>#T#div class=\"chips\">"+(a.flags||[]).map(f=>"#T#span class=\"chip "+chipk(f.k)+"\">"+f.t+"#T#/span>").join("")+"#T#/div>#T#/div>#T#div class=\"px\">#T#b>"+(a.price>=1?money(a.price):("$"+Number(a.price).toPrecision(3)))+"#T#/b>#T#span class=\""+cls(a.chg)+"\">"+pct(a.chg)+"#T#/span>#T#/div>#T#/div>")).join(""):h("#T#div class=\"empty\">Alfa estudia Solana al encenderse.#T#/div>");
document.getElementById("pos").innerHTML=b.pos.length?b.pos.map(p=>h("#T#div class=\"token\">#T#div class=\"meta\">#T#div class=\"name\">"+p.name+"#T#/div>#T#div class=\"sym\">"+p.sym+" @ "+money(p.entry)+"#T#/div>#T#/div>#T#div class=\"px "+cls(p.pnlUsd)+"\">#T#b>"+money(p.pnlUsd)+"#T#/b>#T#span>"+pct(p.pnl)+"#T#/span>#T#/div>#T#/div>")).join(""):h("#T#div class=\"empty\">Sin posiciones abiertas.#T#/div>");
document.getElementById("log").innerHTML=b.trd.length?b.trd.slice(0,24).map(t=>h("#T#div class=\"log\">#T#b class=\""+(t.side==="BUY"?"up":"down")+"\">"+t.side+"#T#/b> "+t.id+" · "+t.why+"#T#/div>")).join(""):h("#T#div class=\"empty\">Sin actividad.#T#/div>");
}
function login(user,pass){
const u=users().find(x=>x.user===user&&x.pass===pass);
if(!u)throw new Error("Usuario o password incorrectos");
db.set("alfa_session",{user,at:Date.now()});render();
studySolana().then(list=>{const b=book();b.audit=list;save(b);render()});
}
document.getElementById("go").onclick=()=>{const f=new FormData(document.getElementById("form"));try{login(String(f.get("user")).trim().toLowerCase(),String(f.get("pass")))}catch(e){document.getElementById("err").textContent=e.message}};
document.getElementById("form").onsubmit=e=>{e.preventDefault();document.getElementById("go").click()};
document.getElementById("reg").onclick=()=>{
const f=new FormData(document.getElementById("form"));
const user=String(f.get("user")).trim().toLowerCase(),pass=String(f.get("pass"));
if(user.length<3||pass.length<4){document.getElementById("err").textContent="Demasiado corto";return}
const list=users();if(list.some(x=>x.user===user)){document.getElementById("err").textContent="Ese usuario ya existe";return}
list.push({user,pass});db.set("alfa_users",list);login(user,pass);
};
document.getElementById("out").onclick=()=>{localStorage.removeItem("alfa_session");location.reload()};
function saveCap(){const b=book();const n=Math.max(100,Number(document.getElementById("cap").value)||b.capital);const used=b.pos.reduce((s,p)=>s+p.entry*p.qty,0);b.capital=n;b.cash=Math.max(0,n-used);mark(b);save(b);render()}
document.getElementById("cap").onchange=saveCap;
document.getElementById("cap").onblur=saveCap;
document.getElementById("power").onchange=async e=>{const b=book();b.bot.on=e.target.checked;b.bot.msg=b.bot.on?"encendiendo...":"apagado";save(b);render();if(b.bot.on)await cycle(true)};
document.getElementById("seg").onclick=ev=>{const btn=ev.target.closest("button");if(!btn)return;document.querySelectorAll("#seg button").forEach(p=>p.classList.toggle("on",p===btn));["audit","book","log"].forEach(v=>document.getElementById("panel-"+v).classList.toggle("hidden",btn.dataset.v!==v))};
users();
if(session()){render();studySolana().then(list=>{const b=book();b.audit=list;save(b);render()})}
setInterval(()=>{if(session()&&book().bot.on)cycle(false)},600000);
