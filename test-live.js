async function fetchLive() {
  const res = await fetch("https://ais-dev-4fgemszni4fnj3pgbi4a5w-63647682235.asia-east1.run.app/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test123456@example.com", password: "password" })
  });
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}
fetchLive();
