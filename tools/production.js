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
function mountTVSymbol(el,q){mountTV('symbol-overview',el,{symbols:[[q.name,(TV[q.id]||'AMEX:'+q.id)+'|1D']],chartOnly:false,width:'100%',height:'100%',autosize:true,showVolume:false,chartType:'area',lineWidth:2,scaleMode:'Normal',fontSize:'10',valuesTracking:'1',changeMode:'price-and-percent',dateRanges:['1d|1','1m|30','3m|60','12m|1D','60m|1W','all|1M']})}

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
function mountTVTape(){const el=$('#tv-tape');if(!el||el.childElementCount||!tvVisible(el))return;
  const ids=['SPX','COMP','INDU','XAU','CL','EURUSD','BTC','ETH','US10Y'];
  mountTV('ticker-tape',el,{symbols:ids.filter(i=>TV[i]).map(i=>({proName:TV[i],title:(INSTR.find(x=>x.id===i)||{}).name||i})),showSymbolLogo:false,displayMode:'adaptive'})}

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
