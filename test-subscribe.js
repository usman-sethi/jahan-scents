fetch('http://localhost:3000/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', phone: '123' })
}).then(async r => console.log(r.status, await r.text())).catch(e => console.error(e));
