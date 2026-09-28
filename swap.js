(function(){
function open(url){
  if(window.alfaOpen)return window.alfaOpen(url);
  var tg=window.Telegram&&window.Telegram.WebApp;
  if(tg&&tg.openLink)tg.openLink(url);
  else window.open(url,"_blank");
}
function amt(){return Math.max(0.05,Number(document.getElementById("swapAmt").value)||0.2)}
function to(){return (document.getElementById("swapTo")||{}).value||"USDT"}
function from(){return (document.getElementById("swapFrom")||{}).value||"TON"}
function hint(){
  var h=document.getElementById("swapHint");
  if(h)h.textContent=amt()+" "+from()+" → "+to()+"  |  firma en el DEX";
}
function bind(){
  ["swapAmt","swapFrom","swapTo"].forEach(function(id){var e=document.getElementById(id);if(e)e.onchange=hint});
  var st=document.getElementById("swapSton");
  if(st)st.onclick=function(){open("https://app.ston.fi/swap?chartVisible=false&ft="+encodeURIComponent(from())+"&tt="+encodeURIComponent(to()))};
  var dd=document.getElementById("swapDedust");
  if(dd)dd.onclick=function(){open("https://dedust.io/swap")};
  var x=document.getElementById("swapX1000");
  if(x)x.onclick=function(){open("https://x1000.finance")};
  hint();
}
bind();
})();
