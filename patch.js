applyCap=function(n){var b=book();n=Math.max(0.5,Number(n)||0.5);b.capital=n;if(!b.bot.on||!b.pos.length){b.cash=n;b.equity=n}save(b);render()};
ticket=function(b){var cap=Math.max(0.5,Number(b.capital||b.cash||0.5));return Math.max(0.5,Math.min(cap*0.35,cap));};
wipeOps=function(b){var cap=Math.max(0.5,Number(b.capital)||0.5);b.capital=cap;b.cash=cap;b.equity=cap;b.pos=[];b.trd=[];b.series={eq:[],buys:[],sells:[]};b.bot={on:false,runs:0,buys:0,sells:0};b.net="TON";return b};
money=function(n){return Number(n||0).toLocaleString("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:2})};
if(typeof openPos==="function"){var _op=openPos;openPos=function(b,a,usd){usd=Math.max(0.5,Math.min(Number(usd)||ticket(b),b.cash));if(!a||!a.price||b.cash<0.5)return false;return _op(b,a,usd)}};
