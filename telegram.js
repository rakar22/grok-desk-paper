function tgApp(){return window.Telegram&&window.Telegram.WebApp?window.Telegram.WebApp:null}
function bootTelegram(){var app=tgApp();if(!app)return;try{app.ready();app.expand();app.setHeaderColor("#f2f2f7");app.setBackgroundColor("#f2f2f7")}catch(e){}}
function livePlus(){try{return Object.assign({pk:"",ton:"",ticket:25,dd:3,ops:40,tgToken:"",tgChat:""},JSON.parse(localStorage.getItem("alfa_live")||"{}"))}catch(e){return {pk:"",ton:""}}}
function savePlus(c){localStorage.setItem("alfa_live",JSON.stringify(c))}
function renderTon(){var c=livePlus();var el=document.getElementById("tonAddr");if(el)el.textContent=c.ton||"-";var st=document.getElementById("tonStatus");if(st)st.textContent=c.ton?"TON lista (Telegram Wallet / TonConnect)":"Telegram Wallet = TON, no Solana"}
function connectTon(){var err=document.getElementById("tonErr");var app=tgApp();var c=livePlus();
if(app&&app.initDataUnsafe&&app.initDataUnsafe.user){
  var u=app.initDataUnsafe.user;
  c.tgUser=String(u.id||"");
}
var inp=document.getElementById("tonPk");
var v=inp?String(inp.value||"").trim():"";
if(v.length>=20){c.ton=v;savePlus(c);renderTon();if(err)err.textContent="Direccion TON guardada. No firma Solana.";return}
if(err)err.textContent="Abre esta Mini App en Telegram y pega tu direccion TON (EQ... / UQ...). No la seed.";
try{window.open("https://t.me/wallet","_blank")}catch(e){}}
document.addEventListener("DOMContentLoaded",function(){bootTelegram();renderTon();var b=document.getElementById("connectTon");if(b)b.onclick=connectTon;var s=document.getElementById("saveTon");if(s)s.onclick=connectTon});
bootTelegram();renderTon();
var _ct=document.getElementById("connectTon");if(_ct)_ct.onclick=connectTon;
var _st=document.getElementById("saveTon");if(_st)_st.onclick=connectTon;
