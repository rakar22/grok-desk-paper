function tgApp(){return window.Telegram&&window.Telegram.WebApp?window.Telegram.WebApp:null}
function bootTelegram(){var app=tgApp();if(!app)return;try{app.ready();app.expand();if(app.setHeaderColor)app.setHeaderColor("#f2f2f7");if(app.setBackgroundColor)app.setBackgroundColor("#f2f2f7")}catch(e){}}
function livePlus(){try{return Object.assign({ton:"",ticket:25,dd:3,ops:40,tgToken:"",tgChat:""},JSON.parse(localStorage.getItem("alfa_live")||"{}"))}catch(e){return {ton:""}}}
function savePlus(c){localStorage.setItem("alfa_live",JSON.stringify(c))}
function renderTon(){var c=livePlus();var el=document.getElementById("tonAddr");if(el)el.textContent=c.ton||"-";var st=document.getElementById("tonStatus");if(st)st.textContent=c.ton?"Wallet TON conectada":"Pulsa Conectar o pega EQ/UQ"}
function saveAddr(v,err){v=String(v||"").trim();if(v.length<10){if(err)err.textContent="No hay direccion.";return}var c=livePlus();c.ton=v;savePlus(c);renderTon();if(err)err.textContent="Direccion TON lista. Sigue en paper."}
function connectTon(){var err=document.getElementById("tonErr");var inp=document.getElementById("tonPk");var typed=inp?String(inp.value||"").trim():"";if(typed.length>=20){saveAddr(typed,err);return}var app=tgApp();
if(window.tonConnectUI){window.tonConnectUI.openModal().catch(function(){if(err)err.textContent="Cierra el modal y reintenta."});return}
if(app&&app.openTelegramLink){app.openTelegramLink("https://t.me/wallet");if(err)err.textContent="Abre Wallet, copia Recibir y pega EQ/UQ aqui.";return}
if(err)err.textContent="En Telegram: Abrir Alfa. Luego Conectar wallet."}
async function bootTonConnect(){if(!window.TON_CONNECT_UI)return;try{var ui=new TON_CONNECT_UI.TonConnectUI({manifestUrl:location.origin+"/tonconnect-manifest.json",buttonRootId:"tonConnectBtn"});window.tonConnectUI=ui;ui.onStatusChange(function(w){if(w&&w.account&&w.account.address){saveAddr(w.account.address,document.getElementById("tonErr"))}});}catch(e){}}
function filterMarket(){var btn=document.querySelector(".segbtn.on");var f=btn?btn.getAttribute("data-filter"):"all";document.querySelectorAll("#auditList .token").forEach(function(el){var tag=((el.querySelector(".tag")||{}).textContent||"").toLowerCase();el.style.display=(f==="all"||tag.indexOf(f)!==-1)?"flex":"none"})}
function wireSeg(){document.querySelectorAll(".segbtn").forEach(function(btn){btn.onclick=function(){document.querySelectorAll(".segbtn").forEach(function(x){x.classList.toggle("on",x===btn)});filterMarket()}})}
function tgGuest(){var app=tgApp();if(!app||typeof login!=="function"||typeof session!=="function")return;if(session())return;var u=app.initDataUnsafe&&app.initDataUnsafe.user;var id="tg"+(u&&u.id?u.id:"guest");try{var list=users();if(!list.some(function(x){return x.user===id})){list.push({user:id,pass:"tg"});db.set("alfa_users",list)}login(id,"tg")}catch(e){}}
bootTelegram();wireSeg();renderTon();bootTonConnect();
var ct=document.getElementById("connectTon");if(ct)ct.onclick=connectTon;
setTimeout(tgGuest,80);
if(typeof render==="function"){var _r=render;render=function(){_r();filterMarket()}}
