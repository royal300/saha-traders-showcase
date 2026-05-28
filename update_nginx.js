import { Client } from 'ssh2';

const nginxConfig = `server {
    listen 80;
    server_name traders.royal300.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name traders.royal300.com;

    ssl_certificate /etc/letsencrypt/live/traders.royal300.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/traders.royal300.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/saha_traders/dist/client;

    # ── Gzip compression ───────────────────────────────────────────────────────
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 5;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_types
        text/plain text/css text/xml text/javascript application/javascript
        application/x-javascript application/json application/xml application/rss+xml
        image/svg+xml font/woff font/woff2 application/font-woff application/font-woff2;

    # ── Uploaded media — 30-day cache with WebP support ────────────────────────
    location /uploads/ {
        alias /var/www/saha_traders/public/uploads/;
        access_log off;
        add_header Cache-Control "public, max-age=2592000, immutable";
        add_header Vary "Accept";
        types {
            image/webp  webp;
            image/jpeg  jpg jpeg;
            image/png   png;
        }
        expires 30d;
    }

    # ── Hashed static JS/CSS bundles — 1 year immutable cache ─────────────────
    location ~* \\.(?:js|css|woff2?|ttf|otf|eot)$ {
        try_files $uri @proxy;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
        expires 1y;
    }

    # ── Static images in dist/client — 7 day cache ─────────────────────────────
    location ~* \\.(?:webp|png|jpe?g|avif|gif|ico|svg)$ {
        try_files $uri @proxy;
        access_log off;
        add_header Cache-Control "public, max-age=604800";
        expires 7d;
    }

    # ── All other requests ─────────────────────────────────────────────────────
    location / {
        try_files $uri @proxy;
    }

    location @proxy {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
        proxy_read_timeout 60s;
    }
}
`;


const conn = new Client();
conn.on('ready', () => {
  console.log('--- Connected to VPS (Nginx Setup) ---');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const stream = sftp.createWriteStream('/etc/nginx/sites-available/traders.royal300.com');
    stream.on('close', () => {
      console.log('Nginx config uploaded successfully!');
      
      const cmd = 'nginx -t && systemctl reload nginx';
      conn.exec(cmd, (execErr, execStream) => {
        if (execErr) throw execErr;
        execStream.on('close', (code) => {
          console.log('Nginx reloaded with code:', code);
          conn.end();
        }).on('data', d => process.stdout.write(d)).stderr.on('data', d => process.stderr.write(d));
      });
    });
    stream.write(nginxConfig);
    stream.end();
  });
}).connect({
  host: '93.127.206.52',
  port: 22,
  username: 'root',
  password: 'Royal300@2026',
  readyTimeout: 20000
});
