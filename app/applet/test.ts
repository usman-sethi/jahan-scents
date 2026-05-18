async function run() {
  try {
    const res = await fetch("http://localhost:3000/api/products");
    const json = await res.json();
    console.log(json);
  } catch(e) {
    console.log("Error:", e);
  }
}
run();
