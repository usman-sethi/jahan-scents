async function run() {
  const loginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test12345@example.com", password: "password" })
  });
  console.log("Login Status:", loginRes.status, await loginRes.text());
}

run();
