import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:16Paradox2006@cluster0.a54grbt.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    await client.db("admin").command({ ping: 1 });
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
