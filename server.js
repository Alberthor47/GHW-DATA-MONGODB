
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://admin:${process.env.PASSWORD}@ghw-data.k58d3rf.mongodb.net/?retryWrites=true&w=majority&appName=GHW-DATA`;

const app = express();
app.use(cors());

let client;

app.get('/movies', async (req, res) => {
  try {
    const { limit } = req.query;
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      await client.connect();
    }
    const db = client.db('sample_mflix');
    const movies = db.collection('movies');
    const result = await movies.find({}, { projection: { _id: 0, title: 1 } }).limit(parseInt(limit)).toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});