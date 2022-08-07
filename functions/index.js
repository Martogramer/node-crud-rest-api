/* eslint-disable indent */
const functions = require("firebase-functions");
const admin = require("firebase-admin")
const express = require("express");

const app = express();

admin.initializeApp({
    credential: admin.credential.cert("./permisos.json"),
});
const db = admin.firestore();

app.get("/server", (req, res) => {
    return res.status(200).json({ message: "GelloGelato" });
});

app.post("/api/products", async (req, res) => {
    try {
        await db
            .collection("products")
            .doc("/" + req.body.id + "/")
            .create({ name: req.body.name });
        return res.status(200).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get("/api/products/:product_id", (req, res) => {
    (async () => {
        try {
            const doc = db.collection("products").doc(req.params.id);
            const item = await doc.get();
            const response = item.data()
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})

app.get("/api/products", async (req, res) => {
    try {
        const query = db.collection("products");
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;
        const response = docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
        }));
        return res.status(200).json(response);
    } catch (error){
        return res.status(500).send(error);
    }
})

app.delete("/api/products/:product_id", async (req, res) => {
    try {
        const document = db.collection("products")
        .doc(req.params.product_id)
        await document.delete();
        return res.status(200).json();
    } catch (error){
        return res.status(500).json();
    }
})

app.put("/api/products/:product_id", async (req, res) => {})

exports.app = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
