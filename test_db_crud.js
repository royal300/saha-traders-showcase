import { Client } from 'ssh2';
import fs from 'node:fs';
import path from 'node:path';

const sqlContent = `
SELECT '1. CURRENT CATEGORIES COUNT' as step, COUNT(*) FROM categories;
SELECT '2. CREATING TEST CATEGORY' as step;
INSERT INTO categories (name, slug, image, banner, blurb, is_featured) 
VALUES ('Auto Test Category', 'auto-test-category-999', '/uploads/test.jpg', NULL, 'Testing autogeneration', 1);
SELECT '3. CONFIRMING INSERT' as step, id, name, slug, is_featured FROM categories WHERE slug = 'auto-test-category-999';
SELECT '4. DELETING TEST CATEGORY' as step;
DELETE FROM categories WHERE slug = 'auto-test-category-999';
SELECT '5. CONFIRMING DELETION' as step, COUNT(*) FROM categories WHERE slug = 'auto-test-category-999';
`;

const conn = new Client();
conn.on('ready', () => {
  console.log('--- Connected to VPS over SSH ---');
  
  conn.exec("mysql -u myadmin -p',mypass' -D saha_marble_tiles", (err, stream) => {
    if (err) {
      console.error('Execution error:', err);
      conn.end();
      process.exit(1);
    }
    
    stream.on('close', (code) => {
      console.log(`\n--- SSH Database Test Completed (Exit Code ${code}) ---`);
      conn.end();
      process.exit(code || 0);
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
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
