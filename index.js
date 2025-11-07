const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(cors());
app.use(express.json())

// smartDealsUser
// G711EN7JqE9SOi25
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tachgq7.mongodb.net/?appName=Cluster0`;
// const uri = "mongodb+srv://smartDealsUser:G711EN7JqE9SOi25@cluster0.tachgq7.mongodb.net/?appName=Cluster0";

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
        // await client.connect();

        const db = client.db('smart_db');
        const productsCollection = db.collection('products');
        const bidsCollection = db.collection('bids');
        const usersCollection = db.collection('users');

        // Users API
        app.post('/users', async(req, res)=>{
            const newUser = req.body;
            const email = req.body.email;
            const query = {email: email};
            const existingUser = await usersCollection.findOne(query);
            if(existingUser){
                res.send({message: "User already exist. do not need to insert again."})
            }
            else{
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        })


        // find all products
        app.get('/products', async (req, res)=> {

            console.log(req.query);
            const email = req.query.email;
            const query = {}
            if(email){
                query.email = email;
            }


            const cursor = productsCollection.find(query).sort({price_min: 1});
            const result = await cursor.toArray();
            res.send(result);
        })

        // Latest Products APIs
        app.get('/latest-products', async (req, res)=> {
            const cursor = productsCollection.find().sort({created_at: -1}).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })
        // find one product
        app.get('/products/:id', async (req, res)=> {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.send(result);
        })


        // app.post('/products', async (req, res)=>{
        //     const newProduct = req.body;
        //     const result = await productsCollection.insertOne(newProduct);
        //     res.send(result);
        // } )
        app.post('/products', async (req, res)=>{
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productsCollection.insertOne(newProduct);
            res.send({
                success: true,
                result
            });
        } )



        app.patch('/products/:id', async (req, res)=> {
            const id = req.params.id;
            const updatedProduct = req.body;
            const query = {_id: new ObjectId(id)};
            const update ={
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price
                }
            }
            const result = await productsCollection.updateOne(query, update);
            res.send(result);
        })
        

        app.delete('/products/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);

        })
        // bids Related APIs
        app.get('/bids', async(req, res)=> {
            const email = req.query.email;
            const query = {};
            if(email){
                query.buyer_email = email;
            }
            const cursor = bidsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/bids', async(req, res)=> {
            const newBid = req.body;
            const result = await bidsCollection.insertOne(newBid);
            res.send(result);
        })
















        // await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally{

    }
}
run().catch(console.dir);








app.listen(port, ()=> {
    console.log(`Smart server is runnig on port: ${port}`);
})