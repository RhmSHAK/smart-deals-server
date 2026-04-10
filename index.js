const express = require('express');
const cors = require('cors');
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

//Eb8TyHKwxqL3pkv3
//smartUserDB


const uri = "mongodb+srv://smartUserDB:Eb8TyHKwxqL3pkv3@cluster0.cmkpjft.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const database = client.db("smartDealsDB");
    const productsCollection = database.collection("products");

    app.get('/products', async (req, res) => {
        const cursor = productsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await productsCollection.findOne(query);
        res.send(result);
    })

    app.post('/products', async (req, res) => {
        const newProduct =req.body;
        const result = await productsCollection.insertOne(newProduct);
        res.send(result);
    })

    app.patch('/products/:id', async (req, res) => {
        const id = req.params.id;
        const updatedProduct = req.body;
        const filter = {_id: new ObjectId(id)};
        const updateDoc = {
            $set: {
                name: updatedProduct.name,
                Price: updatedProduct.Price
            }
        }

        const options = {};
        const result = await productsCollection.updateOne(filter,updateDoc,options);
        res.send(result);
      
    })


    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await productsCollection.deleteOne(query);
        res.send(result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


  } finally {
    
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Smart server is running');
});

app.listen(port, () => {
  console.log(`Smart server is running on port ${port}`);
});

