(function(){
var KEY="alfa_desk_v1";
var timer=null;
var PAIRS=[
  {from:"TON",to:"USDT"},
  {from:"TON",to:"NOT"},
  {from:"TON",to:"DOGS"},
  {from:"USDT",to:"TON"},
  {from:"TON",to:"HMSTR"},
  {from:"TON",to:"CATI"}
];
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return null}}
function save(b){localStorage.setItem(KEY,JSON.stringify(b))}
function init(){
  var b=load();
  if(!b||typeof b!=="object")b={capital:5,cash:5,pos:[],log:[],signals:[],bot:{on:false,runs:0,buys:0,sells:0}};
  if(!b.bot)b.bot={on:false,runs:0,buys:0,sells:0};
  if(!Array.isArray(b.pos))b.pos=[];
  if(!Array.isArray(b.log))b.log=[];
  if(!Array.isArray(b.signals))b.signals=[];
  if(typeof b.capital!=="number")b.capital=5;
  if(typeof b.cash!=="number")b.cash=b.capital;
  save(b);return b;
}
function euro(n){return (Number(n)||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"}
function makeSig(){
  var b=init();
  var p=PAIRS[Math.floor(Math.random()*PAIRS.length)];
  var amt=Math.max(0.5,Math.round(b.capital*0.08*100)/100);
  var txt="DEDUST\nSwap: "+p.from+" -> "+p.to+"\nCantidad: "+amt+" "+p.from+"\nBot: @dedustBot\nNota: senal Alfa paper. No es consejo. Firma tu.";
  var s={t:Date.now(),from:p.from,to:p.to,amt:amt,txt:txt};
  b.signals.unshift(s);b.signals=b.signals.slice(0,20);save(b);return s;
}
function paintSig(){
  var b=init();
  var now=document.getElementById("sigNow");
  var list=document.getElementById("sigList");
  var s=b.signals[0];
  if(now){
    if(!s)now.innerHTML="<p class='hintline'>Pulsa Nueva señal</p>";
    else now.innerHTML="<b>"+s.from+" → "+s.to+"</b><p>"+s.amt+" "+s.from+"</p><pre style='white-space:pre-wrap;font-size:13px'>"+s.txt+"</pre><button type='button' class='cta' id='copySig'>Copiar</button>";
    var c=document.getElementById("copySig");
    if(c)c.onclick=function(){navigator.clipboard.writeText(s.txt).then(function(){c.textContent="Copiado"})};
  }
  if(list)list.innerHTML=b.signals.map(function(x){return "<div class='token'><b>"+x.from+"→"+x.to+"</b><span>"+x.amt+"</span></div>"}).join("");
}
function paint(){
  var b=init();
  var eq=b.cash+(b.pos||[]).reduce(function(s,p){return s+(p.qty||0)*(p.px||0)},0);
  var el=function(id){return document.getElementById(id)};
  if(el("equity"))el("equity").textContent=euro(eq);
  if(el("cash"))el("cash").textContent=euro(b.cash);
  if(el("npos"))el("npos").textContent=String((b.pos||[]).length);
  if(el("runs"))el("runs").textContent=String(b.bot.runs||0);
  if(el("statBuys"))el("statBuys").textContent=String(b.bot.buys||0);
  if(el("statSells"))el("statSells").textContent=String(b.bot.sells||0);
  if(el("liveDot"))el("liveDot").textContent=b.bot.on?"LIVE PAPER":"STANDBY";
  if(el("powerLabel"))el("powerLabel").textContent=b.bot.on?"STOP":"START";
  var btn=el("powerBtn");
  if(btn){btn.style.background=b.bot.on?"#34c759":"#e5e5ea";btn.style.color=b.bot.on?"#fff":"#111"}
  if(el("liveTick"))el("liveTick").textContent=b.bot.on?("Ciclo "+b.bot.runs):"Apagado";
  if(el("ticket"))el("ticket").textContent=euro(Math.max(0.2,b.capital*0.08));
  var cap=el("capHome");if(cap&&document.activeElement!==cap)cap.value=b.capital;
  var cap2=el("cap");if(cap2&&document.activeElement!==cap2)cap2.value=b.capital;
  var pos=el("pos");
  if(pos)pos.innerHTML=(b.pos||[]).map(function(p){return "<div class='token'><b>"+p.sym+"</b><span>"+euro((p.qty||0)*(p.px||0))+"</span></div>"}).join("")||"<p class='hintline'>Sin posiciones</p>";
  paintSig();
}
function cycle(){
  var b=init();
  if(!b.bot.on)return;
  var ticket=Math.max(0.15,Math.min(b.cash*0.2,b.capital*0.1));
  var tok=["TON","USDT","NOT","DOGS"];
  var sym=tok[Math.floor(Math.random()*tok.length)];
  var px=0.1+Math.random()*2;
  if(b.cash>=ticket){b.cash-=ticket;b.pos.push({sym:sym,qty:ticket/px,px:px});b.bot.buys++;b.log.unshift({side:"BUY",sym:sym,notional:ticket});var lb=document.getElementById("lastBuy");if(lb)lb.textContent=sym}
  if(b.pos.length){var p=b.pos.splice(0,1)[0];var exit=p.qty*p.px*(0.97+Math.random()*0.08);b.cash+=exit;b.bot.sells++;var ls=document.getElementById("lastSell");if(ls)ls.textContent=p.sym}
  b.bot.runs++;
  if(b.bot.runs%3===0)makeSig();
  save(b);paint();
}
function start(){if(timer)clearInterval(timer);timer=setInterval(cycle,4000);cycle()}
function stop(){if(timer){clearInterval(timer);timer=null}}
function toggle(){var b=init();b.bot.on=!b.bot.on;if(!b.bot.on){b.pos=[];b.log=[];b.bot.runs=0;b.bot.buys=0;b.bot.sells=0;b.cash=b.capital;stop()}save(b);paint();if(b.bot.on){makeSig();start()}}
function setCap(n){n=Math.max(0.5,Number(n)||0.5);var b=init();b.capital=n;if(!b.bot.on)b.cash=n;save(b);paint()}
function bind(){
  var btn=document.getElementById("powerBtn");if(btn)btn.onclick=function(e){e.preventDefault();toggle()};
  document.querySelectorAll(".chip").forEach(function(c){c.onclick=function(){setCap(c.getAttribute("data-cap"))}});
  var h=document.getElementById("capHome");if(h)h.onchange=function(){setCap(h.value)};
  var c=document.getElementById("cap");if(c)c.onchange=function(){setCap(c.value)};
  var r=document.getElementById("refresh");if(r)r.onclick=function(){paint()};
  var ns=document.getElementById("newSig");if(ns)ns.onclick=function(){makeSig();paintSig()};
  document.querySelectorAll(".tabbar button[data-pane]").forEach(function(b){
    b.onclick=function(){
      document.querySelectorAll(".pane").forEach(function(p){p.classList.toggle("on",p.dataset.pane===b.dataset.pane)});
      document.querySelectorAll(".tabbar button[data-pane]").forEach(function(x){x.classList.toggle("on",x===b)});
    };
  });
}
var a=document.getElementById("auth");if(a)a.classList.add("hidden");
var p=document.getElementById("app");if(p)p.classList.remove("hidden");
bind();paint();
})();
