(function(){
var KEY="alfa_desk_v1";
var timer=null;
var TOKS=["USDT","STON","NOT","MAJOR","tsTON"];
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return null}}
function save(b){localStorage.setItem(KEY,JSON.stringify(b))}
function init(){
  var b=load();
  if(!b||typeof b!=="object")b={capital:5,cash:5,pos:[],signals:[],bot:{on:false,runs:0,buys:0,sells:0}};
  if(!b.bot)b.bot={on:false,runs:0,buys:0,sells:0};
  if(!Array.isArray(b.signals))b.signals=[];
  if(typeof b.capital!=="number")b.capital=5;
  if(typeof b.cash!=="number")b.cash=b.capital;
  save(b);return b;
}
function euro(n){return (Number(n)||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"}
function makeSig(){
  var tok=TOKS[Math.floor(Math.random()*TOKS.length)];
  var ticket=(window.alfaAgent&&window.alfaAgent.ticket&&window.alfaAgent.ticket())||{trade:0.2};
  var s={id:Date.now(),tok:tok,gram:ticket.trade||0.2,sl:8,tp:12,done:false,status:"open"};
  var b=init();b.signals.unshift(s);b.signals=b.signals.slice(0,50);save(b);return s;
}
function markDone(id){
  var b=init();
  b.signals.forEach(function(s){if(s.id===id)s.done=true});
  save(b);paintSig();
}
function paintSig(){
  var b=init();
  var now=document.getElementById("sigNow");
  var list=document.getElementById("sigList");
  var s=b.signals[0];
  if(now){
    if(!s)now.innerHTML="<p class='hintline'>Nueva señal</p>";
    else{
      var u=window.alfaTokenUrls?window.alfaTokenUrls(s.tok):{x1000:"https://x1000.finance",ston:"https://app.ston.fi",dedust:"https://dedust.io/swap"};
      now.innerHTML="<b>Buy "+s.tok+"</b><p>"+s.gram+" GRAM · SL -"+s.sl+"% · TP +"+s.tp+"%</p>"+
        "<p>"+(s.done?"HECHA":"PENDIENTE")+"</p>"+
        "<button type='button' class='cta' data-open='"+u.x1000+"'>Abrir "+s.tok+"</button>"+
        "<button type='button' class='cta' id='didOp'>He hecho esta operacion</button>";
      var d=document.getElementById("didOp");
      if(d)d.onclick=function(){markDone(s.id)};
    }
  }
  if(list)list.innerHTML=b.signals.map(function(x){
    return "<div class='token'><b>"+x.tok+"</b><span>"+x.gram+" GRAM · "+(x.done?"hecha":"pendiente")+"</span></div>";
  }).join("");
}
function paint(){
  var b=init();
  var el=function(id){return document.getElementById(id)};
  if(el("equity"))el("equity").textContent=euro(b.cash);
  if(el("statBuys"))el("statBuys").textContent=String(b.bot.buys||0);
  if(el("statSells"))el("statSells").textContent=String(b.bot.sells||0);
  if(el("liveDot"))el("liveDot").textContent=b.bot.on?"PAPER":"STANDBY";
  if(el("powerLabel"))el("powerLabel").textContent=b.bot.on?"STOP":"START";
  var btn=el("powerBtn");
  if(btn){btn.style.background=b.bot.on?"#34c759":"#e5e5ea";btn.style.color=b.bot.on?"#fff":"#111"}
  var cap=el("capHome");if(cap&&document.activeElement!==cap)cap.value=b.capital;
  paintSig();
}
function cycle(){var b=init();if(!b.bot.on)return;b.bot.runs++;b.bot.buys++;if(b.bot.runs%2===0){b.bot.sells++;makeSig()}save(b);paint()}
function start(){if(timer)clearInterval(timer);timer=setInterval(cycle,5000);cycle()}
function stop(){if(timer){clearInterval(timer);timer=null}}
function toggle(){var b=init();b.bot.on=!b.bot.on;if(!b.bot.on){b.bot.runs=0;b.bot.buys=0;b.bot.sells=0;b.cash=b.capital;stop()}save(b);paint();if(b.bot.on){makeSig();start()}}
function setCap(n){n=Math.max(0.5,Number(n)||0.5);var b=init();b.capital=n;if(!b.bot.on)b.cash=n;save(b);paint()}
function bind(){
  var btn=document.getElementById("powerBtn");if(btn)btn.onclick=function(e){e.preventDefault();toggle()};
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
bind();paint();
})();
