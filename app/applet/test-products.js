async function getLogs() {
  const res = await fetch('http://localhost:3000/api/products');
  const text = await res.text();
  console.log("Status:", res.status, "Body:", text);
}
getLogs();
