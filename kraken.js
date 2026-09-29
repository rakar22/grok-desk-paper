(function(){
var PAIRS=["XXBTZUSD","XETHZUSD","SOLUSD","XXRPZUSD","ADAUSD"];
var LABELS={XXBTZUSD:"BTC/USD",XETHZUSD:"ETH/USD",SOLUSD:"SOL/USD",XXRPZUSD:"XRP/USD",ADAUSD:"ADA/USD"};
var last={};
function pub(path){
  return fetch("https://api.kraken.com/0/public/"+path).then(function(r){return r.json()});
}
function tickers(){
  return pub("Ticker?pair="+PAIRS.join(",")).then(function(j){
    if(!j||j.error&&j.error.length)throw new Error((j.error||[]).join(",")||"ticker");
    last=j.result||{};
    return last;
  });
}
function price(pair){
  var t=last[pair];
  if(!t||!t.c)return null;
  return Number(t.c[0]);
}
function paintTicks(){
  var el=document.getElementById("tickList");
  if(!el)return;
  el.innerHTML=PAIRS.map(function(p){
    var px=price(p);
    return "<div class='token'><b>"+(LABELS[p]||p)+"</b><span>"+(px?px.toLocaleString("en-US",{maximumFractionDigits:4}):"-")+"</span></div>";
  }).join("");
}
function liveLockText(){
  return [
    "LIVE LOCK",
    "El navegador / Mini App NO envia ordenes reales.",
    "Kraken AddOrder exige API-Key + API-Sign HMAC-SHA512.",
    "La secret solo en servidor (VPS) con IP whitelist.",
    "Permisos: Query Funds, Open Orders, Create & Modify, Cancel.",
    "SIN Withdraw.",
    "Spot UAT solo bajo peticion a Kraken.",
    "Futures demo: https://demo-futures.kraken.com",
    "Arranque: python server/kraken_bot.py",
    "Env: KRAKEN_API_KEY KRAKEN_API_SECRET KRAKEN_LIVE=0|1"
  ].join("\n");
}
var box=document.getElementById("liveLock");if(box)box.textContent=liveLockText();
window.alfaKraken={PAIRS:PAIRS,LABELS:LABELS,tickers:tickers,price:price,paintTicks:paintTicks,last:function(){return last}};
})();
