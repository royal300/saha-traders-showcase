import http from 'node:http';
import server from './dist/server/server.js';

const PORT = 3000;

http.createServer(async (req, res) => {
  try {
    // 1. Construct the absolute URL
    const host = req.headers.host || 'localhost';
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const url = new URL(req.url || '/', `${protocol}://${host}`);

    // 2. Read request body if present
    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      body = Buffer.concat(buffers);
    }

    // 3. Translate headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }

    // 4. Create standard Web Request object
    const webReq = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
      duplex: body ? 'half' : undefined
    });

    // 5. Invoke the fetch handler of our SSR server
    const webRes = await server.fetch(webReq, {}, {});

    // 6. Write status and headers back to Node.js response
    res.statusCode = webRes.status;
    
    webRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // 7. Write the body back using standard readable streams
    if (webRes.body) {
      const reader = webRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error('Server Bridge Error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}).listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Saha Traders Node.js Server listening on http://0.0.0.0:${PORT}`);
});
