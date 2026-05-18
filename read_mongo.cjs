const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

const uri = "mongodb+srv://admin:16Paradox2006@cluster0.a54grbt.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("perfume");
    const collection = db.collection("perfume");
    const data = await collection.find({}).toArray();
    fs.writeFileSync('mongo_dump.json', JSON.stringify(data, null, 2));
    console.log("Dumped to mongo_dump.json");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
