async function getLogs() {
  // Since we don't have pm2, we can just hit the API to see if it responds with an HTML page or JSON
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent@example.com', password: 'password' })
  });
  const text = await res.text();
  console.log("Status:", res.status, "Body:", text);
}
getLogs();
