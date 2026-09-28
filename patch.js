applyCap=function(n){var b=book();n=Math.max(2,Number(n)||2);b.capital=n;b.cash=n;b.equity=n;save(b);render()};
ticket=function(b){return Math.max(2,Math.min(40,Number(b.capital||2)*0.25))};
wipeOps=function(b){var cap=Math.max(2,Number(b.capital)||2);b.capital=cap;b.cash=cap;b.equity=cap;b.pos=[];b.trd=[];b.series={eq:[],buys:[],sells:[]};b.bot={on:false,runs:0,buys:0,sells:0};b.net="TON";return b};
money=function(n){return Number(n||0).toLocaleString("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:2})};
emptyBook=function(){return {ver:9,capital:2,cash:2,equity:2,pos:[],trd:[],audit:[],series:{eq:[],buys:[],sells:[]},bot:{on:false,runs:0,buys:0,sells:0},net:"TON"}};
