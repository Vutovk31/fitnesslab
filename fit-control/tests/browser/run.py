"""Run using Python Playwright and an installed Chromium (CHROMIUM_PATH)."""
import functools, http.server, json, os, pathlib, threading, sys
from playwright.sync_api import sync_playwright
from report_contract import require_complete, EXPECTED_PAGE_CASES, EXPECTED_RUNNER_CASES
root = pathlib.Path(__file__).resolve().parents[2]
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_): pass
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(root)))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
    with sync_playwright() as p:
        executable = os.environ.get('CHROMIUM_PATH')
        options = {'executable_path': executable} if executable else {}
        browser = p.chromium.launch(chromium_sandbox=True, **options)
        context = browser.new_context()
        page = context.new_page()
        page.goto(f'http://127.0.0.1:{server.server_port}/tests/browser/')
        page.wait_for_function('Array.isArray(window.fcResults)')
        results = page.evaluate('window.fcResults')
        require_complete(results, EXPECTED_PAGE_CASES)
        page.evaluate("""async () => { const {DiaryStore,make}=window.fc; const db=await DiaryStore.open('persistent-test'); await db.create(make()); db.close(); }""")
        page.reload()
        page.wait_for_function('Array.isArray(window.fcResults)')
        results.append({'name':'document reload preserves IndexedDB', 'pass':page.evaluate("""async () => { const {DiaryStore,date}=window.fc; const db=await DiaryStore.open('persistent-test'); const ok=(await db.list(date)).length===1; db.close(); return ok; }""")})
        context.set_offline(True)
        results.append({'name':'offline read and write after page load','pass':page.evaluate("""async () => { const {DiaryStore,date,make}=window.fc; const db=await DiaryStore.open('persistent-test'); await db.create(make()); const ok=(await db.balance(date,500)).confirmed.kcal.total===360; db.close(); return ok; }""")})
        require_complete(results, EXPECTED_PAGE_CASES + EXPECTED_RUNNER_CASES)
        print(json.dumps({'browser':browser.version,'tests':results}, indent=2))
        browser.close()
        sys.exit(0 if all(r['pass'] for r in results) else 1)
finally:
    server.shutdown()
