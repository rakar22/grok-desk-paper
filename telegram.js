function tgApp(){return window.Telegram&&window.Telegram.WebApp?window.Telegram.WebApp:null}
function bootTelegram(){var app=tgApp();if(!app)return;try{app.ready();app.expand();if(app.setHeaderColor)app.setHeaderColor("#f2f2f7");if(app.setBackgroundColor)app.setBackgroundColor("#f2f2f7")}catch(e){}}
function livePlus(){try{return Object.assign({ton:""},JSON.parse(localStorage.getItem("alfa_live")||"{}"))}catch(e){return {ton:""}}}
function savePlus(c){localStorage.setItem("alfa_live",JSON.stringify(c))}
function renderTon(){var c=livePlus();var el=document.getElementById("tonAddr");if(el)el.textContent=c.ton||"-";var st=document.getElementById("tonStatus");if(st)st.textContent=c.ton?"Wallet TON conectada":"Pulsa Conectar"}
function saveAddr(v,err){v=String(v||"").trim();if(v.length<10){if(err)err.textContent="No hay direccion";return}var c=livePlus();c.ton=v;savePlus(c);renderTon();if(err)err.textContent="Direccion guardada. Paper."}
function connectTon(){var err=document.getElementById("tonErr");var inp=document.getElementById("tonPk");var typed=inp?String(inp.value||"").trim():"";if(typed.length>=20){saveAddr(typed,err);return}if(window.tonConnectUI){window.tonConnectUI.openModal();return}var app=tgApp();if(app&&app.openTelegramLink){app.openTelegramLink("https://t.me/wallet");if(err)err.textContent="Copia Recibir EQ/UQ y pega aqui";return}if(err)err.textContent="Pega EQ o UQ"}
function bootTonConnect(){if(!window.TON_CONNECT_UI)return;try{window.tonConnectUI=new TON_CONNECT_UI.TonConnectUI({manifestUrl:location.origin+"/tonconnect-manifest.json",buttonRootId:"tonConnectBtn"});window.tonConnectUI.onStatusChange(function(w){if(w&&w.account&&w.account.address)saveAddr(w.account.address,document.getElementById("tonErr"))})}catch(e){}}
function showPane(name){document.querySelectorAll(".pane").forEach(function(p){p.classList.toggle("on",p.dataset.pane===name)});document.querySelectorAll(".tabbar button[data-pane]").forEach(function(b){b.classList.toggle("on",b.dataset.pane===name)});var sc=document.querySelector(".scroll");if(sc)sc.scrollTop=0}
function tgGuest(){if(typeof login!=="function")return;if(typeof session==="function"&&session())return;var app=tgApp();var id="tgguest";if(app&&app.initDataUnsafe&&app.initDataUnsafe.user)id="tg"+app.initDataUnsafe.user.id;try{var list=users();if(!list.some(function(x){return x.user===id})){list.push({user:id,pass:"tg"});db.set("alfa_users",list)}login(id,"tg")}catch(e){try{login("trader","desk2026")}catch(e2){}}}
if(tgApp()){bootTelegram();if(!session())tgGuest()}
bootTonConnect();renderTon();
var ct=document.getElementById("connectTon");if(ct)ct.onclick=connectTon;
document.querySelectorAll(".tabbar button[data-pane]").forEach(function(btn){btn.addEventListener("click",function(){showPane(btn.dataset.pane)})});
setTimeout(function(){if(tgApp()&&!session())tgGuest()},200);
