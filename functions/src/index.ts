import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";


admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use(cors());
main.use("/api/v1", app);
main.use(bodyParser.json());

const db = admin.firestore();
const collection = "attributes_list";

export const webApi = functions.https.onRequest(main);

// Add one attribute item

interface AttributeItem {
  gameCode: string;
  gameName: string;
  studio: string;
  theme: string;
  features: string;
  pay: string;
  rtp: string;
  volatility: string;
  popularity: string;
}

// Create new item
app.post("/item", async (req, res) => {
  try {
    const item: AttributeItem = {
      gameCode: req.body["gameCode"],
      gameName: req.body["gameName"],
      studio: req.body["studio"],
      theme: req.body["theme"],
      features: req.body["features"],
      pay: req.body["pay"],
      rtp: req.body["rtp"],
      volatility: req.body["volatility"],
      popularity: req.body["popularity"],
    };

    const newDoc = await db.collection(collection).add(item);
    res.status(201).send(`Created a new item: ${newDoc.id}`);
  } catch (error) {
    res.status(400).send("Wrong attributes has been received");
  }
});

// get all items
app.get("/items", async (_req, res) => {
  try {
    const attrQuerySnapshot = await db.collection(collection).get();
    const attrs: unknown[] = [];
    attrQuerySnapshot.forEach((item) => {
      console.log(item);
      attrs.push({...item.data(), id: item.id});
    });
    res.status(200).json(attrs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get a single item
app.get("/item/:id", (req, res) => {
  const id = req.params.id;
  db.collection(collection)
      .doc(id)
      .get()
      .then((item) => {
        if (!item.exists) throw new Error("Item not found");
        res.status(200).json({...item.data(), id: item.id});
      })
      .catch((error) => res.status(500).send(error));
});

// Delete item
app.delete("/item/:id", (req, res) => {
  db.collection(collection)
      .doc(req.params.id)
      .delete()
      .then(() => res.status(204).send("Document successfully deleted!"))
      .catch(function(error) {
        res.status(500).send(error);
      });
});

// Update item
app.put("/item/:id", async (req, res) => {
  await db
      .collection(collection)
      .doc(req.params.id)
      .set(req.body, {merge: true})
      .then(() => res.json({id: req.params.id}))
      .catch((error) => res.status(500).send(error));
});

exports.fullName = functions.https.onCall((data, _context) => {
  const firstName = data.firstName;
  const lastName = data.lastName;

  return {
    firstName: firstName,
    lastName: lastName,
    fullName: firstName + " " + lastName,
  };
});

// get all items
app.get("/itemsCompact", async (_req, res) => {
  const transFormResponceKeys = (target:AttributeItem) => {
    const shortcutsMap: AttributeItem = {
      "gameCode": "gc",
      "gameName": "gn",
      "theme": "t",
      "features": "f",
      "pay": "p",
      "rtp": "r",
      "volatility": "v",
      "popularity": "p",
      "studio": "s",
    };

    const targetClone = {
      ...target,
    };

    Object.keys(target).forEach((targetKey) => {
      const newKey:string = shortcutsMap[targetKey as keyof AttributeItem];
      const oldValue: string = target[targetKey as keyof AttributeItem];
      if (newKey !== undefined) {
        delete targetClone[targetKey as keyof AttributeItem];
        targetClone[newKey as keyof AttributeItem] = oldValue;
      }
    });
    return targetClone;
  };

  try {
    const attrQuerySnapshot = await db.collection(collection).get();
    const attrs: unknown[] = [];
    attrQuerySnapshot.forEach((item) => {
      const data:unknown = item.data();
      const compactObj = transFormResponceKeys(data as AttributeItem);
      attrs.push({...compactObj, id: item.id});
    });
    res.status(200).json(attrs);
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.getAllItems = functions.https.onCall(async (_data, _context) => {
  try {
    const attrQuerySnapshot = await db.collection(collection).get();
    const attrs: unknown[] = [];
    attrQuerySnapshot.forEach((item) => {
      console.log(item);
      attrs.push({...item.data(), id: item.id});
    });
    return attrs;
  } catch (error) {
    return {
      error: error,
    };
  }
});
