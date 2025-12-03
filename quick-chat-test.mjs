import http from 'http';

const projectId = '3cf4bce6-b6d0-40d4-9e09-91b60a34d4e3';
const query = 'What is a generic framework?';

const data = JSON.stringify({
  projectId,
  query,
  conversationHistory: []
});

console.log('Sending chat request to /api/chat...');
console.log('Project ID:', projectId);
console.log('Query:', query);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('\n=== Response ===');
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(body);
      console.log('Response JSON:');
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Raw body:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
