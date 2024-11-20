const express = require('express')
const cors = require("cors");

const app = express()

// cors required for api call
app.use(cors());
app.use(express.json())

// Mongo DB
const { MongoClient, ObjectId } = require('mongodb')

const uri = 'mongodb://localhost:27017/todos';
const client = new MongoClient(uri);

let db;

// Connect with MongoDB server
async function run() {
    try {
        await client.connect();
        db = client.db('todos');
        const collection = db.collection('todos');

        // Find the first document in the collection
        const first = await collection.findOne();
        console.log(first);

    } finally {
        // Close the database connection when finished or an error occurs
        //await client.close();
    }
}

run().catch(console.error);

// Post Request - use Postman to post json (for testing)
// Add a new TO DO
app.post('/todos', async (req, res) => {
    let collection = await db.collection("todos");
    let newDocument = req.body;
    // newDocument.date = new Date();
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

// Get request
// Get all TO DOs
app.get('/todos', async (req, res) => {
    const todos = await db.collection('todos').find().toArray();
    res.json(todos)
})

// Put request
// Update a TO DO by ID
app.put('/todos', async (req, res) => {
    let collection = await db.collection("todos");

    let result = await collection.findOneAndUpdate({ _id: new ObjectId(req.query.id) }, { $set: req.body });
    console.log("Put called with - id: " + req.query.id);
    res.send(result).status(204);
});

// Delete
// Delete a TO DO
app.delete('/todos', async (req, res) => {
    let collection = await db.collection('todos');
    console.log("Delete called with - id: " + req.query.id)

    let result = await collection.deleteOne({ _id: new ObjectId(req.query.id) });
    res.send(result).status(204);
});

// http://localhost:3001/todos

app.listen(3001, () => {
    console.log("listening")
})