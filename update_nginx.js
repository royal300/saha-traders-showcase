import { Client } from 'ssh2';

const nginxConfig = `server {
    listen 80;
    server_name traders.royal300.com;

    root /var/www/saha_traders/dist/client;

    location /uploads/ {
        alias /var/www/saha_traders/public/uploads/;
        access_log off;
        expires max;
    }

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
