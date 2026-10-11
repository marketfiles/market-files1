/* =========================================================================
   PRODUCTION ($0 launch): free Google research + TradingView futures & charts.
   Appended after the experience; these function declarations wrap the originals
   (renamed *Claude by tools/build_experience.py). If ANTHROPIC_API_KEY is set,
   Market Files AI (Claude) is used; otherwise research runs on Google.
   ========================================================================= */
function aiOn(){return !!(window.MF_CONFIG&&MF_CONFIG.ai)}
/* ---------- TradingView widgets (free; TradingView handles market-data licensing) ---------- */
function mountTV(kind,el,cfg){if(!el)return;el.innerHTML='';const w=document.createElement('div');w.className='tradingview-widget-container';w.style.height='100%';
  const inner=document.createElement('div');inner.className='tradingview-widget-container__widget';inner.style.height='100%';w.appendChild(inner);
  const s=document.createElement('script');s.src=`https://s3.tradingview.com/external-embedding/embed-widget-${kind}.js`;s.async=true;
  s.textContent=JSON.stringify({locale:'en',isTransparent:true,colorTheme:document.documentElement.dataset.theme==='light'?'light':'dark',...cfg});w.appendChild(s);el.appendChild(w)}
function tvFutTabs(){return FUGROUPS.map(g=>({title:g.name,symbols:INSTR.filter(q=>q.fut&&q.fg===g.id&&TV[q.id]).map(q=>({s:TV[q.id],d:q.name}))})).filter(t=>t.symbols.length)}
function tvFuturesBlock(big){return `<section class="pnl tvw-p" data-holo><div class="pnl-h"><h3>Futures · prices &amp; charts</h3><span class="sess mono">Delayed data by TradingView · click any contract for its chart</span></div><div class="tvw ${big?'tvw-lg':''}" id="${big?'tv-fut-page':'tv-fut'}"></div></section>`}
function tvVisible(el){return !!(el&&el.offsetWidth>0)}
function mountTVFutures(){$$('#tv-fut,#tv-fut-page').forEach(el=>{if(el.childElementCount||!tvVisible(el))return;mountTV('market-overview',el,{dateRange:'1D',showChart:true,width:'100%',height:'100%',showSymbolLogo:false,showFloatingTooltip:true,plotLineColorGrowing:'rgba(47,191,119,1)',plotLineColorFalling:'rgba(229,83,75,1)',tabs:tvFutTabs()})})}
function mountHeatmaps(){const a=$('#tv-hm-stk');if(a&&!a.childElementCount&&tvVisible(a))mountTV('stock-heatmap',a,{exchanges:[],dataSource:'SPX500',grouping:'sector',blockSize:'market_cap_basic',blockColor:'change',hasTopBar:false,isDataSetEnabled:false,isZoomEnabled:true,hasSymbolTooltip:true,width:'100%',height:'100%'});
  const b=$('#tv-hm-cr');if(b&&!b.childElementCount&&tvVisible(b))mountTV('crypto-coins-heatmap',b,{dataSource:'Crypto',blockSize:'market_cap_calc',blockColor:'change',hasTopBar:false,isDataSetEnabled:false,isZoomEnabled:true,hasSymbolTooltip:true,isMonoSize:false,width:'100%',height:'100%'})}
function mountTVMain(){const el=$('#tv-main');if(el&&!el.childElementCount&&tvVisible(el))mountTVSymbol(el,INSTR.find(x=>x.id===CHART))}
/* ---------- Market Files charts ----------
   TradingView blocks major index, Treasury and CME symbols inside embedded widgets ("only available on
   TradingView"), so symbol charts are drawn here from /api/chart (real, delayed prices) and always follow the
   site theme. Every chart keeps a link out to TradingView for anyone who wants the full platform. */
const MFC_R=[['1D','1d'],['5D','5d'],['1M','1mo'],['6M','6mo'],['1Y','1y'],['5Y','5y']],MFC_C={};
function mountTVSymbol(el,q){if(!el||!q)return;mfChart(el,q,(el.dataset.rng&&el.dataset.qid===q.id)?el.dataset.rng:'1d')}
async function mfChart(el,q,rng){el.dataset.rng=rng;el.dataset.qid=q.id;
  el.innerHTML=`<div class="mfc"><div class="mfc-top"><div class="mfc-r" role="group" aria-label="Chart range">${MFC_R.map(([l,r])=>`<button type="button" data-r="${r}" aria-pressed="${r===rng}">${l}</button>`).join('')}</div><a class="mfc-tv mono" href="${tvUrl(q.id)}" target="_blank" rel="noopener">TradingView ↗</a></div><div class="mfc-plot"><div class="mfc-msg mono"><i class="mfc-sp"></i>Loading chart</div></div><div class="mfc-ft mono"><span class="mfc-chg"></span><span class="mfc-src"></span></div></div>`;
  el.querySelectorAll('[data-r]').forEach(b=>b.onclick=e=>{e.preventDefault();mfChart(el,q,b.dataset.r)});
  const k=q.id+'|'+rng;let j=MFC_C[k];
  if(!j||Date.now()-j._at>(rng==='1d'||rng==='5d'?60e3:600e3)){try{const r=await fetch(`/api/chart?id=${encodeURIComponent(q.id)}&range=${rng}`);j=r.ok?await r.json():null}catch(e){j=null}if(j&&j.points&&j.points.length>1){j._at=Date.now();MFC_C[k]=j}}
  if(!el.isConnected||el.dataset.rng!==rng||el.dataset.qid!==q.id)return;
  const plot=el.querySelector('.mfc-plot');
  if(!j||!j.points||j.points.length<2){plot.innerHTML=`<div class="mfc-msg mono">No chart data for ${esc(q.name)} right now. <a href="${tvUrl(q.id)}" target="_blank" rel="noopener">View on TradingView ↗</a></div>`;return}
  el.querySelector('.mfc-src').textContent=j.source||'';
  const draw=()=>mfcDraw(plot,el,j,q,rng);draw();
  if('ResizeObserver' in window){if(el._ro)el._ro.disconnect();let w=plot.clientWidth;el._ro=new ResizeObserver(()=>{if(Math.abs(plot.clientWidth-w)>4){w=plot.clientWidth;draw()}});el._ro.observe(plot)}}
function mfcFmt(v,q){const a=Math.abs(v),dp=q&&isFinite(q.dp)?q.dp:(a>=1000?0:a>=10?2:a>=1?3:5);return v.toLocaleString('en-US',{minimumFractionDigits:Math.min(dp,a>=1000?2:dp),maximumFractionDigits:a>=1000?2:dp})}
function mfcTime(t,rng){const d=new Date(t*1000),o={timeZone:'America/New_York'};
  if(rng==='1d')return d.toLocaleTimeString('en-US',{...o,hour:'numeric',minute:'2-digit'});
  if(rng==='5d')return d.toLocaleDateString('en-US',{...o,weekday:'short'})+' '+d.toLocaleTimeString('en-US',{...o,hour:'numeric'});
  if(rng==='5y')return d.toLocaleDateString('en-US',{...o,month:'short',year:'numeric'});
  return d.toLocaleDateString('en-US',{...o,month:'short',day:'numeric'})}
function mfcDraw(plot,el,j,q,rng){const P=j.points,W=Math.max(240,plot.clientWidth||600),H=Math.max(140,plot.clientHeight||260),R=58,B=22,T=10;
  const vs=P.map(p=>p[1]),base=(rng==='1d'&&isFinite(j.prev))?j.prev:vs[0],last=vs[vs.length-1],up=last>=base;
  let lo=Math.min(...vs,rng==='1d'&&isFinite(j.prev)?j.prev:Infinity),hi=Math.max(...vs,rng==='1d'&&isFinite(j.prev)?j.prev:-Infinity);if(hi===lo){hi+=1;lo-=1}const pad=(hi-lo)*.08;lo-=pad;hi+=pad;
  const x=i=>(i/(P.length-1))*(W-R),y=v=>T+(1-(v-lo)/(hi-lo))*(H-T-B);
  const line=P.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(p[1]).toFixed(1)}`).join('');
  const st=(hi-lo)/4,ticks=[0,1,2,3,4].map(i=>lo+st*i+st*0.0);
  const xf=W<460?[0,.5,1]:[0,.25,.5,.75,1],xl=xf.map(f=>Math.round(f*(P.length-1)));
  const col=up?'var(--up)':'var(--dn)',gid='mfg'+Math.random().toString(36).slice(2,8);
  plot.innerHTML=`<svg class="mfc-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(q.name)} price chart, ${rng}" style="color:${col}">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".28"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>
    ${ticks.map(v=>`<line x1="0" x2="${W-R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="mfc-g"/><text x="${W-R+8}" y="${(y(v)+4).toFixed(1)}" class="mfc-t">${mfcFmt(v,q)}</text>`).join('')}
    ${xl.map((i,n)=>`<text x="${x(i).toFixed(1)}" y="${H-6}" class="mfc-t" text-anchor="${n===0?'start':n===xl.length-1?'end':'middle'}">${mfcTime(P[i][0],rng)}</text>`).join('')}
    ${rng==='1d'&&isFinite(j.prev)?`<line x1="0" x2="${W-R}" y1="${y(j.prev).toFixed(1)}" y2="${y(j.prev).toFixed(1)}" class="mfc-prev"/>`:''}
    <path d="${line}L${x(P.length-1).toFixed(1)},${H-B}L0,${H-B}Z" fill="url(#${gid})"/>
    <path d="${line}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${x(P.length-1).toFixed(1)}" cy="${y(last).toFixed(1)}" r="3.5" fill="currentColor"/>
    <g class="mfc-hv" style="display:none"><line class="mfc-hl" y1="${T}" y2="${H-B}"/><circle r="4" fill="currentColor" stroke="var(--bg)" stroke-width="2"/></g>
    <rect x="0" y="0" width="${W-R}" height="${H}" fill="transparent" class="mfc-hit"/></svg><div class="mfc-tip mono" hidden></div>`;
  const pct=(last-base)/base*100,ch=el.querySelector('.mfc-chg');if(ch){ch.textContent=`${pct>=0?'▲ +':'▼ '}${pct.toFixed(2)}% · ${MFC_R.find(r=>r[1]===rng)[0]}${rng==='1d'?' vs prior close':''}`;ch.className='mfc-chg '+(pct>=0?'up':'dn')}
  const svg=plot.querySelector('svg'),hv=svg.querySelector('.mfc-hv'),tip=plot.querySelector('.mfc-tip');
  const move=e=>{const r=svg.getBoundingClientRect(),px=(e.clientX-r.left)*(W/r.width),i=Math.max(0,Math.min(P.length-1,Math.round(px/(W-R)*(P.length-1)))),cx=x(i),cy=y(P[i][1]);
    hv.style.display='';hv.querySelector('line').setAttribute('x1',cx);hv.querySelector('line').setAttribute('x2',cx);const c=hv.querySelector('circle');c.setAttribute('cx',cx);c.setAttribute('cy',cy);
    tip.hidden=false;tip.innerHTML=`<b>${mfcFmt(P[i][1],q)}</b><span>${mfcTime(P[i][0],rng==='1d'||rng==='5d'?rng:'1mo')}${rng==='5y'||rng==='1y'?' '+new Date(P[i][0]*1000).getFullYear():''}</span>`;
    const tx=cx*(r.width/W);tip.style.left=Math.min(Math.max(tx,50),r.width-50)+'px'};
  const out=()=>{hv.style.display='none';tip.hidden=true};
  svg.addEventListener('pointermove',move);svg.addEventListener('pointerdown',move);svg.addEventListener('pointerleave',out)}

/* ---------- Research: Claude when configured, otherwise free Google ---------- */
let GCSE_P=null,GCSE_N=0;
function loadCSE(){if(GCSE_P)return GCSE_P;GCSE_P=new Promise(res=>{window.__gcse={parsetags:'explicit',callback:()=>res(true)};const s=document.createElement('script');s.src='https://cse.google.com/cse.js?cx='+encodeURIComponent(MF_CONFIG.google);s.async=true;s.onerror=()=>res(false);document.head.appendChild(s);setTimeout(()=>res(!!(window.google&&google.search&&google.search.cse)),8000)});return GCSE_P}
const gLink=q=>`<a class="btn btn-p" href="https://www.google.com/search?q=${encodeURIComponent(q)}" target="_blank" rel="noopener">Search Google for “${esc(q)}” ↗</a>`;
async function googleResearch(q){const th=$('#air-thread');if(!th||!q)return;const box=$('#air');if(box)box.hidden=false;
  if(!MF_CONFIG.google){th.innerHTML=gLink(q);return}
  const id='gcse-'+(++GCSE_N);th.innerHTML=`<div id="${id}" class="gcse-box"></div>`;const ok=await loadCSE();
  if(!ok){th.innerHTML=gLink(q);return}
  try{const el=google.search.cse.element;el.render({div:id,tag:'searchresults-only',gname:id});el.getElement(id).execute(q)}catch(e){th.innerHTML=gLink(q)}}
function aiPanel(){if(aiOn())return aiPanelClaude();
  return `<section class="air" id="air" data-holo><div class="air-h"><img src="${LOGO72}" alt="" width="28" height="28"><div><b>Research the web</b><span class="mono dim">${MF_CONFIG.google?'Google results, inside Market Files':'Opens Google in a new tab'}</span></div></div>
  <div class="air-thread" id="air-thread"></div><form class="air-f" id="air-f" hidden><input id="air-i"></form><div id="air-off" hidden></div><button id="air-stop" hidden></button></section>`}
async function askAI(q){return aiOn()?askAIClaude(q):googleResearch(q)}
function wireAIPanel(q,auto){if(aiOn())return wireAIPanelClaude(q,auto);const a=$('#air');if(!q){if(a)a.hidden=true;return}googleResearch(q)}
async function gpAsk(focus,free){if(aiOn())return gpAskClaude(focus,free);const label=($('#gp')||{dataset:{}}).dataset.label||'';location.hash=aiHref(free?`${label} ${free}`:`${label} ${focus} history`)}

/* ---------- crypto chart (TradingView) ---------- */
let CC_MOUNTED='';
function mountCryptoTV(){const el=$('#tv-cr');if(!el||!tvVisible(el))return;if(CC_MOUNTED===CC&&el.childElementCount)return;CC_MOUNTED=CC;mountTVSymbol(el,INSTR.find(x=>x.id===CC));
  $$('[data-cc]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cc===CC)))}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-cc]');if(b){CC=b.dataset.cc;mountCryptoTV()}});

/* ---------- home ticker tape (TradingView) ---------- */
/* ---------- home ticker tape ----------
   Retired: TradingView blocks index and Treasury symbols in embeds (they rendered as white error boxes).
   Live prices on the home page come from the Market Files tiles above it. */
function mountTVTape(){}

/* ---------- Satellite view (opt-in; MapLibre GL globe, Sentinel-2 cloudless imagery by EOX) ----------
   Loads only when a viewer taps "Satellite". Any failure leaves the standard globe in place. */
let SAT=null,SAT_LOADING=null;
function loadMapLibre(){if(window.maplibregl)return Promise.resolve(true);if(SAT_LOADING)return SAT_LOADING;
  SAT_LOADING=new Promise(res=>{const l=document.createElement('link');l.rel='stylesheet';l.href='https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.css';document.head.appendChild(l);
    const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.js';s.async=true;s.onload=()=>res(!!window.maplibregl);s.onerror=()=>res(false);document.head.appendChild(s);setTimeout(()=>res(!!window.maplibregl),12000)});return SAT_LOADING}
function satOff(){if(SAT){try{SAT.map.remove()}catch(e){}SAT.el.remove();SAT=null}const b=$('#sat-btn');if(b){b.setAttribute('aria-pressed','false');b.classList.remove('on')}const cv=$('#globe');if(cv)cv.style.visibility=''}
async function satOn(){const st=$('.gh-stage');if(!st||SAT)return;const b=$('#sat-btn');if(b)b.textContent='…';
  const ok=await loadMapLibre();if(b)b.textContent='Satellite';if(!ok||!st.isConnected)return;
  try{const el=document.createElement('div');el.className='sat';el.setAttribute('aria-label','Satellite globe');st.appendChild(el);
    const map=new maplibregl.Map({container:el,center:[10,25],zoom:1.4,pitch:0,attributionControl:{compact:true},
      style:{version:8,projection:{type:'globe'},sources:{s2:{type:'raster',tileSize:256,maxzoom:13,attribution:'Sentinel-2 cloudless by <a href="https://s2maps.eu" target="_blank" rel="noopener">EOX</a> (Copernicus data, modified)',tiles:['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg']}},layers:[{id:'bg',type:'background',paint:{'background-color':'#05060a'}},{id:'s2',type:'raster',source:'s2'}]}});
    SAT={map,el};let fired=false;map.on('error',e=>{if(!fired&&e&&e.error&&!map.loaded()&&!map.isStyleLoaded()){fired=true;satOff()}});
    map.on('load',()=>{const cv=$('#globe');if(cv)cv.style.visibility='hidden';
      CITIES.filter(c=>c.top||c.ex).forEach(c=>{const d=document.createElement('button');d.className='sat-dot'+(c.top?' top':'');d.setAttribute('aria-label',c.name);d.title=c.name;
        d.onclick=()=>{selectPlace({c,name:c.name,type:'Financial center'});map.flyTo({center:[c.lon,c.lat],zoom:Math.max(map.getZoom(),5),duration:1400})};
        new maplibregl.Marker({element:d}).setLngLat([c.lon,c.lat]).addTo(map)})});
    if(b){b.setAttribute('aria-pressed','true');b.classList.add('on')}
  }catch(e){satOff()}}
function wireSatellite(){const ctl=$('.gh-ctl');if(!ctl||$('#sat-btn'))return;const b=document.createElement('button');b.id='sat-btn';b.className='ib gz-cap';b.type='button';b.textContent='Satellite';b.setAttribute('aria-pressed','false');b.title='Satellite imagery (Sentinel-2)';
  b.onclick=()=>{SAT?satOff():satOn()};ctl.appendChild(b)}
document.addEventListener('click',e=>{if(SAT&&e.target.closest&&e.target.closest('[data-gz="0"]'))satOff()});
window.addEventListener('hashchange',()=>{if(SAT&&!$('.gh-stage'))satOff()});
