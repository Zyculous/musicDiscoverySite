import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_URI || "no connection string";

const client = new MongoClient(connectionString);

let conn;
try {
  console.log("Connecting to MongoDB...");
  conn = await client.connect();
  console.log("Connected to MongoDB");
} catch(e) {
  console.error(e);
}

let db = conn.db("musicDiscovery");

export default db;
