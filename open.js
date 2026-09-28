function alfaOpen(url){
  try{
    var tg=window.Telegram&&window.Telegram.WebApp;
    if(tg){
      if(url.indexOf("t.me/")!==-1&&tg.openTelegramLink){tg.openTelegramLink(url);return}
      if(tg.openLink){tg.openLink(url,{try_instant_view:false});return}
    }
  }catch(e){}
  window.open(url,"_blank");
}
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-open]");
  if(!t)return;
  e.preventDefault();
  alfaOpen(t.getAttribute("data-open"));
});
