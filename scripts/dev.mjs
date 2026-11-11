import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number.parseInt(process.env.PORT ?? '4173', 10);
const networkMode = process.argv.includes('--network');
const host = process.env.HOST ?? (networkMode ? '0.0.0.0' : '127.0.0.1');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? host}`);
    const pathname = requestUrl.pathname === '/' ? '/examples/dashboard.html' : requestUrl.pathname;
    const relativePath = decodeURIComponent(pathname).replace(/^[/\\]+/, '');
    const filePath = resolve(projectRoot, relativePath);

    if (filePath !== projectRoot && !filePath.startsWith(`${projectRoot}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error('Not a file');

    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

server.listen(port, host, () => {
  if (networkMode) {
    const addresses = Object.values(networkInterfaces()).flat().filter(address => address?.family === 'IPv4' && !address.internal);
    console.log('LiteERP network URLs:');
    addresses.forEach(address => console.log(`  http://${address.address}:${port}/examples/dashboard.html`));
  } else {
    console.log(`LiteERP development server: http://${host}:${port}/examples/dashboard.html`);
  }
  console.log('Press Ctrl+C to stop.');
});
