fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test12345@example.com', password: 'password', name: 'Test', phone: '123' })
}).then(async r => {
  const text = await r.text();
  console.log(r.status, text);
}).catch(e => console.error(e));
