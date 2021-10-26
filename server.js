const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 7000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.db_PASS}@cluster0.sovrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("MEDservices");
    const servicescollection = database.collection("services");
    const doctorcollection = database.collection("doctors");

    // get services api
    app.get("/services", async (req, res) => {
      const countbutton = req.query.count;
      const size = parseInt(req.query.size);
      const cursor = servicescollection.find({});
      const count = await cursor.count();
      let result;
      if (countbutton) {
        result = await cursor
          .skip(countbutton * size)
          .limit(size)
          .toArray();
      } else {
        result = await cursor.toArray();
      }
      res.send({
        count,
        result,
      });
    });

    // get doctor api
    app.get("/doctors", async (req, res) => {
      const doctorcursor = doctorcollection.find({});
      const doctorresult = await doctorcursor.toArray();
      res.send(doctorresult);
    });

    //    testing api
    app.post("/details", async (req, res) => {
      const data = req.body.services;
      const query = { services: data };
      const result = await servicescollection.findOne(query);
      res.send(result);
    });

    // post api
    app.post("/doctors", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await doctorcollection.insertOne(data);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(
    "this is form assignment server and chaking for heroku and again chake"
  );
});

app.listen(port, () => {
  console.log("Assignment 10 runing in port :", port);
});
