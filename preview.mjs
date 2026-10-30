import http from 'node:http';
import { readFile } from 'node:fs/promises';

// 仅提供明确列出的公开文件，不读取目录外文件。
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/assets/preview.webp', ['assets/preview.webp', 'image/webp']],
]);
http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  const file = files.get(path);
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const body = await readFile(new URL(file[0], import.meta.url));
    res.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(500); res.end('File unavailable');
  }
}).listen(4183, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4183/'));
