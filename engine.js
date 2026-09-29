(function(){
var KEY="alfa_kraken_v1";
var timer=null;
var mode="demo";
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return null}}
function save(b){localStorage.setItem(KEY,JSON.stringify(b))}
function init(){
  var b=load();
  if(!b||typeof b!=="object")b={capital:100,cash:100,pos:[],log:[],bot:{on:false,runs:0,buys:0,sells:0}};
  if(!b.bot)b.bot={on:false,runs:0,buys:0,sells:0};
  if(!Array.isArray(b.pos))b.pos=[];
  if(!Array.isArray(b.log))b.log=[];
  if(typeof b.capital!=="number")b.capital=100;
  if(typeof b.cash!=="number")b.cash=b.capital;
  save(b);return b;
}
function euro(n){return (Number(n)||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"}
function pairList(){return (window.alfaKraken&&window.alfaKraken.PAIRS)||["XXBTZUSD"];}
function label(p){return (window.alfaKraken&&window.alfaKraken.LABELS&&window.alfaKraken.LABELS[p])||p;}
function pxOf(p){
  var v=window.alfaKraken&&window.alfaKraken.price(p);
  return v&&v>0?v:(10000+Math.random()*100);
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
  if(el("modeDot"))el("modeDot").textContent=mode==="real"?"REAL LOCK":"DEMO";
  if(el("powerLabel"))el("powerLabel").textContent=b.bot.on?"STOP":"START";
  var btn=el("powerBtn");
  if(btn){btn.style.background=b.bot.on?"#34c759":"#e5e5ea";btn.style.color=b.bot.on?"#fff":"#111"}
  if(el("liveTick"))el("liveTick").textContent=b.bot.on?("Demo ciclo "+b.bot.runs):"Apagado";
  if(el("hint"))el("hint").textContent=mode==="real"?"Dinero real bloqueado. Usa server/kraken_bot.py":"START = paper con ticker Kraken";
  if(el("krakenStatus"))el("krakenStatus").textContent=mode==="real"?"LIVE LOCK — no hay AddOrder desde la Mini App":"Demo — ticker publico Kraken";
  var cap=el("capHome");if(cap&&document.activeElement!==cap)cap.value=b.capital;
  var d=el("modeDemo"),r=el("modeReal");
  if(d)d.classList.toggle("on",mode==="demo");
  if(r)r.classList.toggle("on",mode==="real");
  var pos=el("pos");
  if(pos)pos.innerHTML=(b.pos||[]).map(function(p){return "<div class='token'><b>"+label(p.sym)+"</b><span>"+euro((p.qty||0)*(p.px||0))+"</span></div>"}).join("")||"<p class='hintline'>Sin posiciones</p>";
  var log=el("log");
  if(log)log.innerHTML=(b.log||[]).slice(0,30).map(function(x){return "<div class='token'><b>"+x.side+" "+label(x.sym)+"</b><span>"+euro(x.notional)+"</span></div>"}).join("");
  if(window.alfaKraken&&window.alfaKraken.paintTicks)window.alfaKraken.paintTicks();
}
function cycle(){
  var b=init();
  if(!b.bot.on||mode!=="demo")return;
  var pairs=pairList();
  var sym=pairs[Math.floor(Math.random()*pairs.length)];
  var px=pxOf(sym);
  var ticket=Math.max(5,Math.min(b.cash*0.15,b.capital*0.08));
  if(b.cash>=ticket){
    b.cash-=ticket;
    b.pos.push({sym:sym,qty:ticket/px,px:px});
    b.bot.buys++;
    b.log.unshift({side:"BUY",sym:sym,notional:ticket});
    var lb=document.getElementById("lastBuy");if(lb)lb.textContent=label(sym);
  }
  if(b.pos.length){
    var p=b.pos.splice(0,1)[0];
    var now=pxOf(p.sym)||p.px;
    var sl=p.px*0.992,tp=p.px*1.008;
    var exitPx=now<=sl||now>=tp?now:p.px*(0.997+Math.random()*0.008);
    var exit=p.qty*exitPx;
    b.cash+=exit;
    b.bot.sells++;
    b.log.unshift({side:"SELL",sym:p.sym,notional:exit});
    var ls=document.getElementById("lastSell");if(ls)ls.textContent=label(p.sym);
  }
  b.bot.runs++;
  b.log=b.log.slice(0,80);
  save(b);paint();
}
function start(){if(timer)clearInterval(timer);timer=setInterval(cycle,4000);cycle()}
function stop(){if(timer){clearInterval(timer);timer=null}}
function toggle(){
  if(mode==="real"){
    alert("LIVE LOCK: el dinero real no se opera desde esta app. Usa el bot de servidor en Kraken.");
    return;
  }
  var b=init();
  b.bot.on=!b.bot.on;
  if(!b.bot.on){b.pos=[];b.log=[];b.bot.runs=0;b.bot.buys=0;b.bot.sells=0;b.cash=b.capital;stop()}
  save(b);paint();
  if(b.bot.on)start();
}
function setCap(n){n=Math.max(10,Number(n)||10);var b=init();b.capital=n;if(!b.bot.on)b.cash=n;save(b);paint()}
function setMode(m){
  mode=m==="real"?"real":"demo";
  if(mode==="real"){
    var b=init();b.bot.on=false;save(b);stop();
  }
  paint();
}
function refreshPx(){
  if(!window.alfaKraken)return paint();
  window.alfaKraken.tickers().then(paint).catch(function(){paint()});
}
function bind(){
  var btn=document.getElementById("powerBtn");if(btn)btn.onclick=function(e){e.preventDefault();toggle()};
  var h=document.getElementById("capHome");if(h)h.onchange=function(){setCap(h.value)};
  var r=document.getElementById("refresh");if(r)r.onclick=refreshPx;
  var d=document.getElementById("modeDemo");if(d)d.onclick=function(){setMode("demo")};
  var rl=document.getElementById("modeReal");if(rl)rl.onclick=function(){setMode("real")};
  document.querySelectorAll(".tabbar button[data-pane]").forEach(function(b){
    b.onclick=function(){
      document.querySelectorAll(".pane").forEach(function(p){p.classList.toggle("on",p.dataset.pane===b.dataset.pane)});
      document.querySelectorAll(".tabbar button[data-pane]").forEach(function(x){x.classList.toggle("on",x===b)});
    };
  });
}
bind();refreshPx();
setInterval(function(){if(window.alfaKraken)window.alfaKraken.tickers().then(function(){if(window.alfaKraken.paintTicks)window.alfaKraken.paintTicks()}).catch(function(){})},15000);
})();
