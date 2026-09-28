if(typeof applyCap==="function"){var _ac=applyCap;applyCap=function(n){n=Math.max(2,Number(n)||2);_ac(n)}};
if(typeof ticket==="function"){ticket=function(b){return Math.max(2,Math.min(40,Number(b.capital||2)*0.25))}};
if(typeof wipeOps==="function"){var _w=wipeOps;wipeOps=function(b){var cap=Math.max(2,Number(b.capital)||2);var x=_w(b);x.capital=cap;if(!x.bot.on){x.cash=cap;x.equity=cap}return x}}
if(typeof money==="function"){var _m=money;money=function(n){return Number(n||0).toLocaleString("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:2})}}
