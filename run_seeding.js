import { Client } from 'ssh2';
import fs from 'node:fs';
import path from 'node:path';

const conn = new Client();
conn.on('ready', () => {
  console.log('--- Connected to VPS for Seeding ---');
  
  // Read local seed file
  const seedPath = path.join(process.cwd(), 'seed.js');
  const seedContent = fs.readFileSync(seedPath, 'utf8');
  
  console.log('Uploading seed.js to VPS `/var/www/saha_traders/seed_temp.js`...');
  
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      process.exit(1);
    }
    
    const writeStream = sftp.createWriteStream('/var/www/saha_traders/seed_temp.js');
    writeStream.on('close', () => {
      console.log('Upload complete. Executing seeding script on VPS...');
      
      // Execute the uploaded script using remote node
      conn.exec('cd /var/www/saha_traders && node seed_temp.js && rm seed_temp.js', (execErr, stream) => {
        if (execErr) {
          console.error('Execution error:', execErr);
          conn.end();
          process.exit(1);
        }
        
        stream.on('close', (code) => {
          console.log(`\n--- Seeding completed with exit code ${code} ---`);
          conn.end();
          process.exit(code || 0);
        }).on('data', (data) => {
          process.stdout.write(data);
        }).stderr.on('data', (data) => {
          process.stderr.write(data);
        });
      });
    });
    
    writeStream.on('error', (streamErr) => {
      console.error('Stream write error:', streamErr);
      conn.end();
      process.exit(1);
    });
    
    writeStream.write(seedContent);
    writeStream.end();
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
}).connect({
  host: '93.127.206.52',
  port: 22,
  username: 'root',
  password: 'Royal300@2026',
  readyTimeout: 20000
});
