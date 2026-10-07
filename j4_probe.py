import urllib.request,urllib.error,json,hashlib,time,re,pathlib
routes=[('GET','/',None)]
for i in range(60):
    try:
        urllib.request.urlopen('http://127.0.0.1:3000/',timeout=3)
        break
    except Exception:
        time.sleep(2);continue
else:
    raise SystemExit('BOOT FAILED')
out=[]
for method,path,body in routes:
    req=urllib.request.Request('http://127.0.0.1:3000'+path,method=method,headers={'Accept':'text/html'})
    try:r=urllib.request.urlopen(req,timeout=15)
    except urllib.error.HTTPError as e:r=e
    raw=r.read().decode('utf8','replace');ct=r.headers.get('Content-Type','').split(';')[0]
    raw=re.sub(r'(src|href)="[^"]*\.(js|css)[^"]*"',r'\1="NORMALIZED"',raw)
    out.append(dict(method=method,path=path,status=r.code,content_type=ct,sha256=hashlib.sha256(raw.encode()).hexdigest(),body=raw))
pathlib.Path('surface.actual.json').write_text(json.dumps(out,indent=2))
print(json.dumps(out,indent=2))
assert all(x['status']<500 for x in out),'server error in measured surface'
expected=pathlib.Path('surface.json')
if expected.exists():assert json.loads(expected.read_text())==out,'CHARACTERIZATION DRIFT'
print('BOOT + CHARACTERIZATION PASS')
