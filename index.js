const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zoj9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
        await client.connect();
        console.log('connected to database')
        const database = client.db('tourismHotel');
        const servicesCollection = database.collection('services')

        // reviews collection 
        const reviewsCollection = database.collection('reviews');
    

//GET API
    app.get('/services', async(req, res) =>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    });


// GET SINGLE SERVICE 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })
        

//POST API
    app.post('/services', async(req, res) => {
        const service = req.body;
          console.log('Hit the post api', service);
        const result = await servicesCollection.insertOne(service);
        console.log(result);
        res.json(result);  
    });

//UPDATE API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
             res.json(result)
           
        })

// //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })



// reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);

        })
        

    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Running  Server')
});



app.listen(port, () => {
    console.log('Tourism Running Server on port', port)
});