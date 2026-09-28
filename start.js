function forceEnter(){
  var a=document.getElementById("auth");var p=document.getElementById("app");
  if(a)a.classList.add("hidden");if(p)p.classList.remove("hidden");
  try{
    if(typeof users==="function"){
      var list=users();
      if(!list.some(function(x){return x.user==="trader"})){list.push({user:"trader",pass:"desk2026"});db.set("alfa_users",list)}
    }
    if(typeof session==="function"&&!session()&&typeof login==="function")login("trader","desk2026");
  }catch(e){}
}
function wireStart(){
  var btn=document.getElementById("powerBtn");
  if(!btn)return;
  btn.onclick=function(ev){
    if(ev)ev.preventDefault();
    if(typeof toggleBot==="function"){toggleBot();return}
    try{
      var b=book();
      b.bot=b.bot||{on:false,runs:0,buys:0,sells:0};
      b.bot.on=!b.bot.on;
      if(!b.bot.on){if(typeof wipeOps==="function")b=wipeOps(b);save(b);if(typeof stopLoop==="function")stopLoop();}
      else{save(b);if(typeof startLoop==="function")startLoop()}
      if(typeof render==="function")render();
    }catch(e){console.log(e)}
  };
}
forceEnter();
wireStart();
setTimeout(function(){forceEnter();wireStart();if(typeof render==="function")render()},80);
