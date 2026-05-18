import http from 'http';

http.get('http://localhost:3000/api/products', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      console.log(rawData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
