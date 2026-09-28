function tgApp(){return window.Telegram&&window.Telegram.WebApp?window.Telegram.WebApp:null}
function bootTelegram(){var app=tgApp();if(!app)return;try{app.ready();app.expand();if(app.setHeaderColor)app.setHeaderColor("#f2f2f7");if(app.setBackgroundColor)app.setBackgroundColor("#f2f2f7")}catch(e){}}
function livePlus(){try{return Object.assign({ton:"",ticket:25,dd:3,ops:40,tgToken:"",tgChat:""},JSON.parse(localStorage.getItem("alfa_live")||"{}"))}catch(e){return {ton:""}}}
function savePlus(c){localStorage.setItem("alfa_live",JSON.stringify(c))}
function renderTon(){var c=livePlus();var el=document.getElementById("tonAddr");if(el)el.textContent=c.ton||"-";var st=document.getElementById("tonStatus");if(st)st.textContent=c.ton?"Direccion TON guardada · paper":"Pega EQ... o UQ... No la seed"}
function connectTon(){var err=document.getElementById("tonErr");var c=livePlus();var inp=document.getElementById("tonPk");var v=inp?String(inp.value||"").trim().replace(/\s+/g,""):"";if(v.length<20||v.indexOf(" ")!==-1){if(err)err.textContent="Pega solo la direccion publica TON.";return}c.ton=v;savePlus(c);renderTon();if(err)err.textContent="Guardada. LIVE sigue bloqueado."}
function filterMarket(){var btn=document.querySelector(".segbtn.on");var f=btn?btn.getAttribute("data-filter"):"all";document.querySelectorAll("#auditList .token").forEach(function(el){var tag=((el.querySelector(".tag")||{}).textContent||"").toLowerCase();var ok=f==="all"||tag.indexOf(f)!==-1;el.style.display=ok?"flex":"none"})}
function wireSeg(){document.querySelectorAll(".segbtn").forEach(function(btn){btn.onclick=function(){document.querySelectorAll(".segbtn").forEach(function(x){x.classList.toggle("on",x===btn)});filterMarket()}})}
function tgGuest(){var app=tgApp();if(!app||typeof login!=="function"||typeof session!=="function")return;if(session())return;var u=app.initDataUnsafe&&app.initDataUnsafe.user;var id="tg"+(u&&u.id?u.id:"guest");try{var list=users();if(!list.some(function(x){return x.user===id})){list.push({user:id,pass:"tg"});db.set("alfa_users",list)}login(id,"tg")}catch(e){}}
bootTelegram();
wireSeg();
renderTon();
var ct=document.getElementById("connectTon");if(ct)ct.onclick=connectTon;
setTimeout(tgGuest,80);
if(typeof render==="function"){var _r=render;render=function(){_r();filterMarket()}}
