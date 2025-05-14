const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port  = process.env.PORT || 3000;


app.use(cors());// to have access from other port 
app.use(express.json());// to able to use json data


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.1k8uoge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    
    // ! doing CRUD's C -> create
    // to add coffee(AddCoffee.jsx) 
    const coffeeCollection = client.db("coffeeStoreDB").collection("addNewCoffee")
    app.post('/addNewCoffee',async(req,res)=>{
        const newCoffee = req.body;
        // console.log(newCoffee)
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// root 
app.get('/',(req,res)=>{
    res.send("Coffee is getting ready to warm to up!")
})

// listing to the port
app.listen(port , ()=>{
    console.log(`Coffee server is listing to port "${port}"`);
})

