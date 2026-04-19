import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import transactionRouter from "./transactionRouter.js";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://smartUserDB:Eb8TyHKwxqL3pkv3@cluster0.cmkpjft.mongodb.net/?appName=Cluster0";
//const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("smartDealsDB");
    const productsCollection = database.collection("products");
    const bidsCollection = database.collection("bids");

    // ================= PRODUCTS API =================

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find(req.query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;

      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };

      const result = await productsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // ================= BIDS API =================

    app.use("/api", transactionRouter(bidsCollection));

    // app.get('/bids', async (req, res) => { 
     // const cursor = bidsCollection.find().sort({bid_price: -1}).limit(3).project({_id: 0, buyer_name: 1, bid_price: 1}); 
     // const cursor = bidsCollection.find(); 
     // const result = await cursor.toArray(); 
     // res.send(result); 
     // })


    app.get("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bidsCollection.findOne(query);
      res.send(result);
    });

    app.post("/bids", async (req, res) => {
      const newBid = req.body;
      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });

    app.delete("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bidsCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // console.log("✅ Connected to MongoDB");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("Smart server is running");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});