import { Client } from 'ssh2';
import fs from 'node:fs';
import path from 'node:path';

const conn = new Client();
conn.on('ready', () => {
  console.log('--- Connected to VPS for Migrations ---');
  
  // Read local schema file
  const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
  const sqlContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Connect to mysql and pipe the SQL content
  console.log('Executing database schema creation on VPS...');
  
  conn.exec(`mysql -u root -p'mypass' -D saha_marble_tiles`, (err, stream) => {
    if (err) {
      console.error('Execution error:', err);
      conn.end();
      process.exit(1);
    }
    
    stream.on('close', (code) => {
      console.log(`\n--- Migrations completed with exit code ${code} ---`);
      conn.end();
      process.exit(code || 0);
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    // Write SQL content directly to standard input of the mysql client on VPS!
    stream.write(sqlContent);
    stream.end();
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
