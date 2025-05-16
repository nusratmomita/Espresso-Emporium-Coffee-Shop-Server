const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // to have access from other port
app.use(express.json()); // to able to use json data

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.1k8uoge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client
      .db("coffeeStoreDB")
      .collection("addNewCoffee");

    // ! doing CRUD's R -> read
    // showing already added coffees in the UI
    app.get("/coffee", async (req, res) => {
      // const cursor = coffeeCollection.find();
      // const result = await cursor.toArray();

      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    // ! getting single coffee details
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    });

    // ! doing CRUD's C -> create
    // to add coffee(AddCoffee.jsx)
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      // console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // ! doing CRUD's U -> update
    app.put('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = { _id : new ObjectId(id) };

      const options = { upset: true };
      const updatedCoffee = req.body;// getting the form body
      const updatedDoc = {
        $set: updatedCoffee
      }

      // * line 65 is written in short form detailed version is below--
      // const updatedDoc = {
      //   $set:{
      //     name: updatedCoffee.name,
      //     taste: updatedCoffee.taste,
      //     and so on
      //   }
      // }


      const result = await coffeeCollection.updateOne(filter,updatedDoc,options);
      res.send(result);
    })

    // ! doing CRUD's D -> delete
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // console.log(id,query)

      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// root
app.get("/", (req, res) => {
  res.send("Coffee is getting ready to warm to up!");
});

// listing to the port
app.listen(port, () => {
  console.log(`Coffee server is listing to port "${port}"`);
});
