(function(){
var MAP={
  USDT:{addr:"EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"},
  STON:{addr:"EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO"},
  NOT:{addr:"EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT"},
  MAJOR:{addr:"EQCuPmQE4wUWaha1YTGoi63xTOIKw-e65iXK6hblZJOR"},
  tsTON:{addr:"EQC98_qAmNEptUtPc7W6xdHh_ZHrBUFpw5Ft_IzNU20QAJav"}
};
function open(url){
  if(window.alfaOpen)return window.alfaOpen(url);
  var tg=window.Telegram&&window.Telegram.WebApp;
  if(tg&&url.indexOf("t.me/")!==-1&&tg.openTelegramLink)tg.openTelegramLink(url);
  else if(tg&&tg.openLink)tg.openLink(url);
  else window.open(url,"_blank");
}
function tok(){return (document.getElementById("swapTo")||{}).value||"USDT"}
function urls(sym){
  var m=MAP[sym]||MAP.USDT;
  return {
    ston:"https://app.ston.fi/swap?ft=TON&tt="+encodeURIComponent(m.addr),
    dedust:"https://dedust.io/swap/TON/"+m.addr,
    x1000:"https://x1000.finance/?token="+encodeURIComponent(m.addr)
  };
}
window.alfaTokenUrls=urls;
function bind(){
  var st=document.getElementById("swapSton");
  if(st)st.onclick=function(){open(urls(tok()).ston)};
  var dd=document.getElementById("swapDedust");
  if(dd)dd.onclick=function(){open(urls(tok()).dedust)};
  var x=document.getElementById("swapX1000");
  if(x)x.onclick=function(){open(urls(tok()).x1000)};
}
bind();
})();
