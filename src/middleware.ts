import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_HOSTS = new Set(['slgevents.in', 'www.slgevents.in']);

const TRANSFORMING_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Site is getting transformed</title>
<style>
  html, body {
    height: 100%;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #0d1117;
    color: #e6edf3;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .box { padding: 24px; }
  h1 { font-size: 1.6rem; margin: 0 0 8px; }
  p { color: #9aa4af; margin: 0; }
</style>
</head>
<body>
  <div class="box">
    <h1>Site is getting transformed</h1>
    <p>Please check back soon.</p>
  </div>
</body>
</html>`;

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';

  if (BLOCKED_HOSTS.has(host)) {
    return new NextResponse(TRANSFORMING_HTML, {
      status: 503,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
