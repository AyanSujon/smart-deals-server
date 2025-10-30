const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(cors());
app.use(express.json())

// smartDealsUser
// G711EN7JqE9SOi25
const uri = "mongodb+srv://smartDealsUser:G711EN7JqE9SOi25@cluster0.tachgq7.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/', (req, res)=> {
    res.send('Smart Server is running');
})

async function run (){
    try{
        await client.connect();

        const db = client.db('smart_db');
        const productsCollection = db.collection('products');
        app.post('/product', async (req, res)=>{
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        } )





















        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally{

    }
}
run().catch(console.dir);








app.listen(port, ()=> {
    console.log(`Smart server is runnig on port: ${port}`);
})