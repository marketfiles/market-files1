"""Market Files experience generator.

SOURCE OF TRUTH:  experience/source/market-files.html   (edit this file)
GENERATED OUTPUT: public/experience/market-files.js, app/globals.css, app/experience-shell.ts
                  (never edit these by hand; they are overwritten)

  npm run experience:build   regenerate the three output files from the source
  npm run experience:check   verify the committed outputs match the source (used by CI)

An explicit source path may still be passed:  python3 tools/build_experience.py path/to/file.html
"""
import re, sys, json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
args = [a for a in sys.argv[1:] if not a.startswith('--')]
CHECK = '--check' in sys.argv[1:]
SOURCE = pathlib.Path(args[0]) if args else root / 'experience' / 'source' / 'market-files.html'
src = SOURCE.read_text()

# ---------- articles: content/articles.json is the single source ----------
# The source file keeps a generated mirror of the real articles between these markers so it
# still opens on its own in a browser. Edit content/articles.json, never the region.
ART_BEGIN = '/* ARTICLES:BEGIN generated from content/articles.json - do not edit here; edit that file, then run: npm run experience:build */'
ART_END = '/* ARTICLES:END */'
def articles_region():
    arts = json.loads((root / 'content' / 'articles.json').read_text())
    lines = []
    for a in arts:
        line = json.dumps({'type': 'hist', **a}, ensure_ascii=False, separators=(',', ':'))
        assert '</' not in line, 'article contains </ and cannot be embedded in a script: ' + a['slug']
        lines.append(line + ',')
    return ART_BEGIN + '\n' + '\n'.join(lines) + '\n' + ART_END
_m = re.search(re.escape(ART_BEGIN) + r'\n(?:.*?\n)?' + re.escape(ART_END), src, re.S)
assert _m, 'missing ARTICLES:BEGIN/END markers in the source'
_synced = src[:_m.start()] + articles_region() + src[_m.end():]
if _synced != src:
    if CHECK:
        print('The article region of experience/source/market-files.html is out of date with content/articles.json.')
        print('Run: npm run experience:build  (and commit the result)')
        sys.exit(1)
    if not args:
        SOURCE.write_text(_synced)
    src = _synced

css = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
body = src.split('<body>', 1)[1]
shell, rest = body.split('<script>\n/* =====', 1)
js = '/* =====' + rest.rsplit('</script>', 1)[0]

def rep(s, a, b, count=1):
    assert a in s, 'missing: ' + a[:80]
    return s.replace(a, b, count)

# ---------- real-URL sections: client list must match lib/sections.ts ----------
_client = re.search(r"const REAL_PATHS=\[([^\]]*)\];", src)
_server = re.search(r"SECTION_PATHS = \[([^\]]*)\] as const;", (root / 'lib' / 'sections.ts').read_text())
assert _client and _server, 'could not find REAL_PATHS (source) or SECTION_PATHS (lib/sections.ts)'
_names = lambda m: re.findall(r"'([^']+)'", m.group(1))
if _names(_client) != _names(_server):
    print('REAL_PATHS in experience/source/market-files.html does not match SECTION_PATHS in lib/sections.ts.')
    print('  source:', _names(_client)); print('  server:', _names(_server))
    print('Make both lists identical (same names, same order).')
    sys.exit(1)

# ---------- shell: production copy ----------
shell = re.sub(r'src="data:image/png;base64,[^"]+"', 'src="/logo-72.png"', shell)
shell = rep(shell, '<span id="tk-src">SIMULATED</span>', '<span id="tk-src">LIVE · DELAYED</span>')

# ---------- css ----------

# ---------- js ----------
js = re.sub(r"const LOGO72='data:image/png;base64,[^']+';", "const LOGO72='/logo-72.png';", js)
js = re.sub(r"const LOGO240='data:image/png;base64,[^']+';", "const LOGO240='/logo-240.png';", js)
js = re.sub(r"const LOGOS72='data:image/png;base64,[^']+';", "const LOGOS72='/logo-silver-72.png';", js)
js = re.sub(r"const LOGOS240='data:image/png;base64,[^']+';", "const LOGOS240='/logo-silver-240.png';", js)
# production never shows demo stories: sample articles removed, headlines come from /api/news
js = rep(js, "const BY=Object.fromEntries(A.map(a=>[a.slug,a]));", "A.splice(0,A.length,...A.filter(a=>a.status!=='sample'));\nconst BY=Object.fromEntries(A.map(a=>[a.slug,a]));")
js = rep(js, "const SITE_URL='https://www.themarketfiles.com'; // placeholder domain", "const SITE_URL=(window.MF_CONFIG&&MF_CONFIG.siteUrl)||location.origin;")
js = rep(js, "const Feed=SimulatedFeed; // ← replace with a live provider implementing the same interface", open(root/'tools/livefeed.js').read())
js = rep(js, "/^(#\\/?)?$|^#\\/(companies|dashboard)/.test(location.hash)", "/^\\/?$|^\\/(companies|dashboard)/.test(curRaw())")
js = rep(js, "<span>9:30</span><span>11:00</span><span>12:30</span><span>14:00</span><span>16:00 ET</span>", "${Feed.live?'<span>Earlier</span><span>Now</span>':'<span>9:30</span><span>11:00</span><span>12:30</span><span>14:00</span><span>16:00 ET</span>'}")
js = re.sub(r'(\w)\.v\*\1\.sup', r'mcap(\1)', js)
js = rep(js, "const fmtCap=", "const mcap=q=>q.mc??q.v*q.sup;\nconst fmtCap=")
js = rep(js, "const tries=[()=>viaDatamaps(TOPO_SRC[0])", "const tries=[async()=>{const [w,u]=await Promise.all([fetch('/geo/world.json').then(r=>{if(!r.ok)throw 0;return r.json()}),fetch('/geo/us.json').then(r=>r.ok?r.json():{features:[]})]);return[w,u]},()=>viaDatamaps(TOPO_SRC[0])")
js = rep(js, "'Built-in copy · sign in to Claude for the live database'", "'Built-in copy · database offline'")
js = rep(js, "Market Files AI runs on Claude. Open this page signed in to Claude to use it.", "Market Files AI is temporarily unavailable. Please try again shortly.")
js = rep(js, "<p class=\"dim\">Market Files AI runs on Claude — open this page signed in to Claude to use it.</p>", "")
js = rep(js, "Preview content: facts are drafted for review", "Editorial note: facts marked In review are drafted")
js = rep(js, "m.style.color='var(--up)';m.textContent=`You’re on the list, ${v}. The first Weekly File is coming soon.`;f.reset()}}",
  "m.style.color='var(--tx3)';m.textContent='Subscribing…';fetch('/api/newsletter',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:v})}).then(async r=>{const j=await r.json().catch(()=>({}));if(r.ok){m.style.color='var(--up)';m.textContent=j.message||'You’re subscribed. Check your inbox to confirm.';f.reset()}else{m.style.color='var(--dn)';m.textContent=j.error||'Couldn’t subscribe right now. Please try again.'}}).catch(()=>{m.style.color='var(--dn)';m.textContent='Couldn’t subscribe right now. Please try again.'})}}")

js = js.replace("$('#ld-page').textContent=", "($('#ld-page')||{}).textContent=")
for name in ('theme-color', 'description'):
    js = js.replace("$('meta[name=\"%s\"]').content=" % name, "($('meta[name=\"%s\"]')||{}).content=" % name)
js = rep(js, "const xUrl=h=>`https://x.com/${h}`;", "const xUrl=h=>`https://x.com/${h}`;\nObject.values(DESKS).forEach(d=>{const f=(window.MF_CONFIG&&MF_CONFIG.pfps||{})[d.handle];if(f)d.pfp=f});")
# ---- $0 launch hooks: Google research + TradingView ----
for fn in ('function aiPanel(){', 'async function askAI(q){', 'function wireAIPanel(q,auto){', 'async function gpAsk(focus,free){'):
    name = fn.split('(')[0].split()[-1]
    js = rep(js, fn, fn.replace(name + '(', name + 'Claude('))
js = rep(js, '${stripTiles(DESK_INST.futures)}<div style="height:28px"></div>', '${window.MF_TV_FUT?tvFuturesBlock(true):stripTiles(DESK_INST.futures)}<div style="height:28px"></div>')
js = rep(js, '<table class="crt fut-t">', '<table class="crt fut-t${window.MF_TV_FUT?\' tv\':\'\'}">')
js = rep(js, '<div class="side-c">${lineChart(ser,q.prev)}', '<div class="side-c">${window.MF_TV?\'<div class="tvw tvw-sm" id="tv-sym"></div>\':lineChart(ser,q.prev)}')
js = rep(js, "const d=$('#inst');if(!d.open)d.showModal()}", "const d=$('#inst');if(!d.open)d.showModal();if(window.MF_TV)mountTVSymbol($('#tv-sym'),q)}")
for a_,b_ in [('Research “${esc(q)}” with Market Files AI','Research “${esc(q)}”'),('Research with Market Files AI','Research further'),('✦ MARKET FILES AI · ECONOMIC & FINANCIAL HISTORY','✦ RESEARCH · ECONOMIC & FINANCIAL HISTORY'),('✦ Ask Market Files AI','✦ Research'),('Ask Market Files AI','Research on Google'),('with Market Files AI','on Google'),('Market Files AI research','research'),('Market Files AI','Market Files research')]: js = js.replace(a_, b_)
js = rep(js, "if(typeof mountTVTape==='function')mountTVTape();", "if(typeof mountTVTape==='function')mountTVTape();if(typeof wireSatellite==='function')wireSatellite();")
js = js + '\n' + open(root/'tools/production.js').read()
# Crypto deep links mount charts during the initial route. Initialize their state first.
js = rep(js, "let CC_MOUNTED='';\n", "")
chart_state = re.search(r'^const MFC_R=.*;\n', js, re.M).group(0)
js = rep(js, chart_state, "")
js = rep(js, "\nroute();", "\nlet CC_MOUNTED='';\n" + chart_state + "route();")
css += '\n#sat-btn{width:auto;min-width:44px;padding:0 10px;font:600 10.5px var(--mono);letter-spacing:.06em;white-space:nowrap}.tvw.tvw-tape{height:78px;padding:0}.gh-stage{position:relative}.sat{position:absolute;inset:0;z-index:3;background:#05060a;border-radius:inherit;overflow:hidden}.gh-ctl{z-index:5}.sat-dot{width:11px;height:11px;border-radius:50%;border:1px solid #F5C451;background:rgba(245,196,81,.35);box-shadow:0 0 10px rgba(245,196,81,.8);padding:0;cursor:pointer}.sat-dot.top{background:#F5C451}.sat-dot:hover,.sat-dot:focus-visible{box-shadow:0 0 0 4px rgba(245,196,81,.35),0 0 14px #F5C451;outline:0}\n.tvw{height:520px;padding:0 8px 8px}.tvw-lg{height:680px}.tvw-sm{height:320px;padding:0}.tvw-p{margin-bottom:1px}.fut-t.tv th:nth-child(4),.fut-t.tv th:nth-child(5),.fut-t.tv th:nth-child(6),.fut-t.tv td:nth-child(4),.fut-t.tv td:nth-child(5),.fut-t.tv td:nth-child(6){display:none}.gcse-box{min-height:120px}.gcse-box .gsc-control-cse{background:transparent!important;border:0!important;padding:0!important}\n'
runtime = open(root/'tools/runtime.js').read()
NOTE = 'GENERATED by tools/build_experience.py from experience/source/market-files.html. DO NOT EDIT. Edit the source, then run: npm run experience:build'
outputs = {
    'public/experience/market-files.js': '/* ' + NOTE + ' */\n' + runtime + '\n' + js,
    'app/globals.css': '/* ' + NOTE + ' */\n' + css,
    'app/experience-shell.ts': '// ' + NOTE + '\nexport const SHELL_HTML = ' + json.dumps(shell) + ';\n',
}
if CHECK:
    stale = [p for p, text in outputs.items() if not (root/p).exists() or (root/p).read_text() != text]
    if stale:
        print('Generated files are out of date with experience/source/market-files.html:')
        for p in stale: print('  - ' + p)
        print('Run: npm run experience:build  (and commit the result)')
        sys.exit(1)
    print('ok: generated files match the source')
else:
    for p, text in outputs.items(): (root/p).write_text(text)
    print('ok', len(js), len(css), len(shell))
