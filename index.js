const express = require('express')
const app = express()
const cors = require('cors');
require("dotenv").config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// const stripe = require('stripe')(process.env.STRIPE_SECRET)


const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9nw5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('doctor_portals');
        const doctorCollection = database.collection('doctors');
        const usersCollection = database.collection('users');
        const appointmentCollection = database.collection('appointment');



        //get doctors
        app.get('/doctors', async (req, res) => {

            const cursor = doctorCollection.find({});
            const doctor = await cursor.toArray();
            res.send(doctor);
        })


        //user post api
        app.post('/users', async (req, res) => {
            const appointment = req.body;
            const result = await usersCollection.insertOne(appointment)
            console.log(result);
            res.json(result)
        })
        //user put api for google  
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        //apointment get api
        app.get('/appoinment', async (req, res) => {
            const params = req.params;

            const cursor = appointmentCollection.find({});
            const order = await cursor.toArray();
            // console.log(order);
            res.json(order);
        })


        //appointment post api
        app.post('/appoinment', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentCollection.insertOne(appointment)

            res.json(result)
        })

        //Delete appointment API

        app.delete('/appoinment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await appointmentCollection.deleteOne(query);
            // console.log("delet with id:", result);
            res.json(result);
        })



    }


    finally {

    }
}
run().catch(console.dir);

console.log(uri);
app.get('/', (req, res) => {
    res.send('Hello doctor portal')
})

app.listen(port, () => {
    console.log(` listening at ${port}`)
})