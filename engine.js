(function(){
var KEY="alfa_desk_v1";
var timer=null;
var TOKS=["USDT","STON","NOT","MAJOR","FRT","tsTON"];
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return null}}
function save(b){localStorage.setItem(KEY,JSON.stringify(b))}
function init(){
  var b=load();
  if(!b||typeof b!=="object")b={capital:5,cash:5,pos:[],log:[],signals:[],bot:{on:false,runs:0,buys:0,sells:0}};
  if(!b.bot)b.bot={on:false,runs:0,buys:0,sells:0};
  if(!Array.isArray(b.signals))b.signals=[];
  if(!Array.isArray(b.pos))b.pos=[];
  if(typeof b.capital!=="number")b.capital=5;
  if(typeof b.cash!=="number")b.cash=b.capital;
  save(b);return b;
}
function euro(n){return (Number(n)||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"}
function makeSig(){
  var tok=TOKS[Math.floor(Math.random()*TOKS.length)];
  var gram=0.2;
  var sl=8,tp=12,hold=25;
  var txt=["X1000","https://x1000.finance","TAB: Tokens","BUSCA: "+tok,"ACCION: Buy","CANTIDAD: "+gram+" GRAM","STOP LOSS: -"+sl+"% -> Sell","TAKE PROFIT: +"+tp+"% -> Sell","TIEMPO: "+hold+" min -> Sell"].join("\n");
  var s={t:Date.now(),tok:tok,gram:gram,sl:sl,tp:tp,hold:hold,txt:txt,status:"open"};
  var b=init();b.signals.unshift(s);b.signals=b.signals.slice(0,20);save(b);return s;
}
function expireSigs(){var b=init();var now=Date.now();b.signals.forEach(function(s){if(s.status==="open"&&now-s.t>25*60*1000)s.status="cierra-sell"});save(b)}
function paintSig(){
  expireSigs();
  var b=init();
  var now=document.getElementById("sigNow");
  var list=document.getElementById("sigList");
  var s=b.signals[0];
  if(now){
    if(!s)now.innerHTML="<p class='hintline'>Pulsa Nueva señal</p>";
    else now.innerHTML="<b>x1000 Buy "+s.tok+"</b><p>"+s.gram+" GRAM</p><p>SL -"+s.sl+"% · TP +"+s.tp+"%</p><pre style='white-space:pre-wrap;font-size:13px'>"+s.txt+"</pre><button type='button' class='cta' id='copySig'>Copiar</button><button type='button' class='cta' data-open='https://x1000.finance'>Abrir x1000</button>";
    var c=document.getElementById("copySig");
    if(c)c.onclick=function(){navigator.clipboard.writeText(s.txt).then(function(){c.textContent="Copiado"})};
  }
  if(list)list.innerHTML=b.signals.map(function(x){return "<div class='token'><b>Buy "+x.tok+"</b><span>"+x.gram+" GRAM</span></div>"}).join("");
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
  var cap=el("capHome");if(cap&&document.activeElement!==cap)cap.value=b.capital;
  paintSig();
}
function cycle(){
  var b=init();if(!b.bot.on)return;
  var ticket=Math.max(0.15,Math.min(b.cash*0.2,b.capital*0.1));
  var tok=TOKS[Math.floor(Math.random()*TOKS.length)];
  if(b.cash>=ticket){b.cash-=ticket;b.pos.push({sym:tok,qty:1,px:ticket,sl:ticket*0.92,tp:ticket*1.12});b.bot.buys++}
  b.pos=b.pos.filter(function(p){var n=p.px*(0.94+Math.random()*0.14);if(n<=p.sl||n>=p.tp){b.cash+=n;b.bot.sells++;return false}return true});
  b.bot.runs++;if(b.bot.runs%2===0)makeSig();save(b);paint();
}
function start(){if(timer)clearInterval(timer);timer=setInterval(cycle,5000);cycle()}
function stop(){if(timer){clearInterval(timer);timer=null}}
function toggle(){var b=init();b.bot.on=!b.bot.on;if(!b.bot.on){b.pos=[];b.bot.runs=0;b.bot.buys=0;b.bot.sells=0;b.cash=b.capital;stop()}save(b);paint();if(b.bot.on){makeSig();start()}}
function setCap(n){n=Math.max(0.5,Number(n)||0.5);var b=init();b.capital=n;if(!b.bot.on)b.cash=n;save(b);paint()}
function bind(){
  var btn=document.getElementById("powerBtn");if(btn)btn.onclick=function(e){e.preventDefault();toggle()};
  document.querySelectorAll(".chip").forEach(function(c){c.onclick=function(){setCap(c.getAttribute("data-cap"))}});
  var h=document.getElementById("capHome");if(h)h.onchange=function(){setCap(h.value)};
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
