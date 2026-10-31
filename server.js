const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const databaseName = 'my-db';
const mongoUrl =
  process.env.MONGODB_URI ||
  'mongodb://admin:password@localhost:27017/my-db?authSource=admin';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/images/:filename', function (req, res) {
  const imagePath = path.join(__dirname, 'images', req.params.filename);
  const img = fs.readFileSync(imagePath);
  res.writeHead(200, { 'Content-Type': 'image/jpeg' });
  res.end(img);
});

async function getDb() {
  const client = await MongoClient.connect(mongoUrl);
  return client.db(databaseName);
}

app.post('/update-profile', async function (req, res) {
  try {
    const userObj = req.body || {};
    const userid = Number(userObj.userid ?? 1);
    userObj.userid = userid;

    const db = await getDb();
    await db.collection('users').updateOne(
      { userid },
      { $set: userObj },
      { upsert: true }
    );

    res.json(userObj);
  } catch (error) {
    console.error('Failed to save profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.get('/get-profile', async function (_req, res) {
  try {
    const db = await getDb();
    const profile = await db.collection('users').findOne({ userid: 1 });
    res.json(profile || {});
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    res.status(500).json({});
  }
});

app.listen(PORT, function () {
  console.log(`app listening on port ${PORT}!`);
});
