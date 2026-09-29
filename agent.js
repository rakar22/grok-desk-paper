(function(){
var K="alfa_agent_v1";
function plan(){
  var g=Math.max(0.1,Number(document.getElementById("agentGram").value)||1.12);
  var r=Math.min(20,Math.max(2,Number(document.getElementById("agentRisk").value)||15))/100;
  var reserve=Math.max(0.25,g*0.22);
  var trade=Math.max(0.08,Math.min(0.35,(g-reserve)*r));
  trade=Math.round(trade*100)/100;
  var maxTrades=Math.max(1,Math.floor((g-reserve)/trade));
  var sl=8,tp=12;
  var stopDay=Math.round(g*0.25*100)/100;
  var txt=[
    "ALFA MAESTRO — bankroll",
    "GRAM total: "+g,
    "Reserva red: "+reserve.toFixed(2)+" GRAM",
    "Ticket: "+trade+" GRAM por Buy",
    "Max trades abiertos: 1",
    "Trades posibles: "+maxTrades,
    "Stop loss: -"+sl+"%",
    "Take profit: +"+tp+"%",
    "Para el dia si pierdes "+stopDay+" GRAM",
    "No firmes si impacto alto.",
    "El agente no pulsa Buy."
  ].join("\n");
  var out={g:g,trade:trade,reserve:reserve,maxTrades:maxTrades,sl:sl,tp:tp,stopDay:stopDay,txt:txt};
  localStorage.setItem(K,JSON.stringify(out));
  return out;
}
function paint(p){
  var el=document.getElementById("agentOut");
  if(!el||!p)return;
  el.innerHTML="<b>Ticket "+p.trade+" GRAM</b>"+
    "<p>Reserva "+p.reserve.toFixed(2)+" · max 1 posicion</p>"+
    "<p>SL -"+p.sl+"% · TP +"+p.tp+"%</p>"+
    "<p>Stop diario "+p.stopDay+" GRAM</p>"+
    "<pre style='white-space:pre-wrap;font-size:13px'>"+p.txt+"</pre>"+
    "<button type='button' class='cta' id='agentCopy'>Copiar plan</button>";
  var c=document.getElementById("agentCopy");
  if(c)c.onclick=function(){navigator.clipboard.writeText(p.txt).then(function(){c.textContent="Copiado"})};
}
function bind(){
  var b=document.getElementById("agentRun");
  if(b)b.onclick=function(){paint(plan())};
  try{var old=JSON.parse(localStorage.getItem(K)||"null");if(old)paint(old)}catch(e){}
}
bind();
window.alfaAgent={plan:plan};
})();
