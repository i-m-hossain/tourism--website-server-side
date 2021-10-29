const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//----------- middleware ---------------//
app.use(cors())
app.use(express.json())
//-------- client and uri mongodb------------//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krune.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("Eventdb");
        const eventCollection = database.collection("events");
        // ------------------------ API endpoints --------------------------//

        // create a service
        app.post('/services/add', async (req, res) => {
            const service = req.body;
            const result = await eventCollection.insertOne(service);
            res.json(result);
        })

        //read all the services
        app.get('/services', async (req, res) => {
            const cursor = eventCollection.find({})
            const result = await cursor.toArray()
            res.send(result);
        })

        // de a single service
        app.get('/services/:id', async (req, res) => {
            const serviceId = req.params.id;
            const query = { _id: ObjectId(serviceId) }
            const result = await eventCollection.findOne(query)
            res.json(result);
        })

        //delete a service
        app.delete('/services/:id', async (req, res) => {
            const serviceId = req.params.id;
            const query = { _id: ObjectId(serviceId) }
            const result = await eventCollection.deleteOne(query)
            res.json(result);
        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

//------------------Initial api---------------------//
app.get('/', (req, res) => {
    res.send('hello world')
})
app.listen(port, () => {
    console.log(`app started at http://localhost:${port}`);
})