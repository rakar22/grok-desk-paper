(function(){
var SK="alfa_sess_v1";
var AK="alfa_agent_v1";
var CK="alfa_chat_v1";
function sess(){try{return JSON.parse(localStorage.getItem(SK)||"null")}catch(e){return null}}
function setSess(s){localStorage.setItem(SK,JSON.stringify(s))}
function chat(){try{return JSON.parse(localStorage.getItem(CK)||"[]")}catch(e){return[]}}
function setChat(a){localStorage.setItem(CK,JSON.stringify(a.slice(-80)))}
function planFrom(g,r){
  g=Math.max(0.1,Number(g)||1.12);
  r=Math.min(20,Math.max(2,Number(r)||15))/100;
  var reserve=Math.max(0.25,g*0.22);
  var trade=Math.round(Math.max(0.08,Math.min(0.35,(g-reserve)*r))*100)/100;
  return {g:g,trade:trade,reserve:reserve,sl:8,tp:12,stopDay:Math.round(g*0.25*100)/100};
}
function ticketText(p){return p?("Ticket "+p.trade+" GRAM | reserva "+p.reserve.toFixed(2)+" | SL -"+p.sl+"% TP +"+p.tp+"%"):"Ticket -"}
function paintTicket(){
  var p;try{p=JSON.parse(localStorage.getItem(AK)||"null")}catch(e){p=null}
  if(!p)p=planFrom(1.12,15);
  var t=document.getElementById("ticketLine");if(t)t.textContent=ticketText(p);
  var o=document.getElementById("agentOut");
  if(o)o.innerHTML="<b>"+ticketText(p)+"</b><p>1 posicion. Stop dia "+p.stopDay+" GRAM</p>";
}
function savePlan(){
  var g=(document.getElementById("agentGram")||{}).value;
  var r=(document.getElementById("agentRisk")||{}).value;
  var p=planFrom(g,r);localStorage.setItem(AK,JSON.stringify(p));paintTicket();return p;
}
function reply(text,hasImg){
  var p;try{p=JSON.parse(localStorage.getItem(AK)||"null")}catch(e){}
  if(!p)p=planFrom(1.12,15);
  var q=(text||"").toLowerCase();
  if(hasImg)return "Imagen guardada en tu sesion. Aqui no hay vision remota. Ticket sugerido: "+p.trade+" GRAM. Si el chart es NOT/STON/USDT, usa SL -8%.";
  if(q.indexOf("ticket")!==-1||q.indexOf("cuanto")!==-1)return ticketText(p);
  if(q.indexOf("stop")!==-1||q.indexOf("sl")!==-1)return "SL -"+p.sl+"%. Cierra con Sell en x1000.";
  if(q.indexOf("not")!==-1)return "Buy NOT  "+p.trade+" GRAM. Slippage 1%. Tax off.";
  return "Plan: "+ticketText(p)+". Pregunta ticket, SL o ticker. No firmo yo.";
}
function paintChat(){
  var box=document.getElementById("chatLog");if(!box)return;
  box.innerHTML=chat().map(function(m){
    return "<div class='token'><b>"+m.who+"</b><span>"+(m.img?"[foto] ":"")+m.text+"</span></div>";
  }).join("")||"<p class='hintline'>Escribe</p>";
}
function send(){
  var inp=document.getElementById("chatIn");
  var file=document.getElementById("chatFile");
  var text=(inp&&inp.value||"").trim();
  var f=file&&file.files&&file.files[0];
  if(!text&&!f)return;
  var a=chat();
  if(f){
    var r=new FileReader();
    r.onload=function(){
      a.push({who:"tu",text:text||"foto",img:true,data:String(r.result).slice(0,80)});
      a.push({who:"maestro",text:reply(text,true)});
      setChat(a);paintChat();
    };
    r.readAsDataURL(f);
  }else{
    a.push({who:"tu",text:text});
    a.push({who:"maestro",text:reply(text,false)});
    setChat(a);paintChat();
  }
  if(inp)inp.value="";
}
function boot(){
  var s=sess();
  var gate=document.getElementById("gate");
  var app=document.getElementById("app");
  if(s&&s.email){
    if(gate)gate.classList.add("hidden");
    if(app)app.classList.remove("hidden");
    var w=document.getElementById("who");if(w)w.textContent=s.email;
  }else{
    if(gate)gate.classList.remove("hidden");
    if(app)app.classList.add("hidden");
  }
  paintTicket();paintChat();
}
function bind(){
  var go=document.getElementById("emailGo");
  if(go)go.onclick=function(){
    var em=((document.getElementById("emailIn")||{}).value||"").trim().toLowerCase();
    if(!em||em.indexOf("@")<1)return;
    setSess({email:em,t:Date.now()});boot();
  };
  var ar=document.getElementById("agentRun");if(ar)ar.onclick=savePlan;
  ["ticketUp","ticketUp2"].forEach(function(id){var e=document.getElementById(id);if(e)e.onclick=savePlan});
  var cs=document.getElementById("chatSend");if(cs)cs.onclick=send;
}
bind();boot();
window.alfaAgent={savePlan:savePlan,ticket:function(){try{return JSON.parse(localStorage.getItem(AK)||"null")}catch(e){return null}}};
})();
