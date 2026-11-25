const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const port = Number(process.env.PORT || 4216);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript',
  '.json':'application/json', '.svg':'image/svg+xml', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png', '.otf':'font/otf', '.ttf':'font/ttf' };
http.createServer((req, res) => {
  const name = req.url.split('?')[0].slice(1) || 'index.html';
  if (!['GET','HEAD'].includes(req.method) || !/^(?:[\w-]+\.(?:html|css|js)|catalogue\.json|assets\/[\w-]+\.(?:png|jpg|webp|svg|otf|ttf))$/.test(name)) {
    return res.writeHead(404).end();
  }
  const file = path.join(__dirname, name);
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) return res.writeHead(404).end();
    res.writeHead(200, {'Content-Type':types[path.extname(name)], 'Content-Length':stat.size, 'Cache-Control':'no-cache'});
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
  });
}).listen(port, '0.0.0.0', () => {
  console.log('http://localhost:' + port);
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses || []) {
      if (!address.internal && address.family === 'IPv4') console.log('http://' + address.address + ':' + port);
    }
  }
});
