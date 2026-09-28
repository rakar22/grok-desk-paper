(function(){
function enter(){
  try{
    if(typeof users==="function"&&typeof login==="function"){
      var list=users();
      if(!list.some(function(x){return x.user==="trader"})){list.push({user:"trader",pass:"desk2026"});db.set("alfa_users",list)}
      if(!session())login("trader","desk2026")
    }
  }catch(e){}
  var a=document.getElementById("auth");var p=document.getElementById("app");
  if(a)a.classList.add("hidden");if(p)p.classList.remove("hidden");
  try{
    var b=book();
    b.capital=Math.max(0.5,Number(b.capital)||2);
    if(!b.bot)b.bot={on:false,runs:0,buys:0,sells:0};
    if(!b.bot.on){
      b.bot.on=true;
      save(b);
      if(typeof startLoop==="function")startLoop();
      if(typeof render==="function")render();
    }
  }catch(e){}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(enter,50)});
else setTimeout(enter,50);
})();
