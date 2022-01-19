import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use("/api/v1", app);
main.use(bodyParser.json());

const db = admin.firestore();
const collection = "attributes_list";

export const webApi = functions.https.onRequest(main);
/*
app.get("/warmup", (request, response) => {
  response.send("Warming up friend.");
});*/

// Add one attribute item

interface AttributeItem {
  gameCode: string;
  gameName: string;
  theme: string;
  features: string;
  pay: string;
  rtr: string;
  volatility: string;
  popularity: string;
}

// Create new item
app.post("/attributes", async (req, res) => {
  try {
    const item: AttributeItem = {
      gameCode: req.body["gameCode"],
      gameName: req.body["gameName"],
      theme: req.body["theme"],
      features: req.body["features"],
      pay: req.body["pay"],
      rtr: req.body["rtr"],
      volatility: req.body["volatility"],
      popularity: req.body["popularity"],
    };

    const newDoc = await db.collection(collection).add(item);
    res.status(201).send(`Created a new item: ${newDoc.id}`);
  } catch (error) {
    res.status(400).send("Wrong attributes list was received");
  }
});

// get all items
app.get("/attributes", async (req, res) => {
  try {
    const attrQuerySnapshot = await db.collection(collection).get();
    const attrs: unknown[] = [];
    attrQuerySnapshot.forEach((doc) => {
      console.log(doc);
      attrs.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    res.status(200).json(attrs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get a single item
app.get("/attributes/:id", (req, res) => {
  const id = req.params.id;
  db.collection(collection)
      .doc(id)
      .get()
      .then((item) => {
        if (!item.exists) throw new Error("Item not found");
        res.status(200).json({
          id: item.id,
          data: item.data(),
        });
      })
      .catch((error) => res.status(500).send(error));
});

// Delete item
app.delete("/attributes/:id", (req, res) => {
  db.collection(collection)
      .doc(req.params.id)
      .delete()
      .then(() => res.status(204).send("Document successfully deleted!"))
      .catch(function(error) {
        res.status(500).send(error);
      });
});

// Update item
app.put("/attributes/:id", async (req, res) => {
  await db
      .collection(collection)
      .doc(req.params.id)
      .set(req.body, {merge: true})
      .then(() => res.json({id: req.params.id}))
      .catch((error) => res.status(500).send(error));
});
