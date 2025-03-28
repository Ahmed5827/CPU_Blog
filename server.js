const express = require("express");
const path = require("path");
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');

const app = express();
const port = 3000;


const uri = "*****";
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
    // Send a ping to confirm a successful connection
    await client.db("DB1").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

async function getCollection(collectionName) {
    try {
      await client.connect();
      const database = client.db("DB1"); // Replace "DB1" with your actual database name
      const collection = database.collection(collectionName); // Replace with your collection name
      return collection;
    } catch (err) {
      console.error("Error connecting to the database:", err);
      throw err;
    }
  }


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
// Routes to serve HTML files
app.get("/", async (req, res) => {
    /*
    try {
        const collection = await getCollection("Posts"); // Replace with your collection name
        const data = await collection.find({}).toArray(); 
        console.log (data)
        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("An error occurred while fetching data");
        }*/

  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/posts", async (req, res) => {
     try {
          const collection = await getCollection("Posts"); // Replace with your collection name
          const data = await collection.find({}).toArray(); 
          console.log (data)
          res.status(200).json(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send("An error occurred while fetching data");
          }
    }    
)

app.post("/posts", async (req, res) => {
    try {
        const collection = await getCollection("Posts"); // Replace with your collection name
        const data = await collection.insertOne({ ...req.body }); 
        console.log (data)
        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("An error occurred while fetching data");
        }
})

app.patch("/posts/:id", async (req, res) => {
    try {
        const collection = await getCollection("Posts"); // Replace with your collection name
        const data = await collection.updateOne({id: req.params.id}, req.body); 
        console.log (data)
        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("An error occurred while fetching data");
        }
})


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
