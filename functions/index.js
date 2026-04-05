/* eslint-disable eol-last */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable padded-blocks */
/* eslint-disable object-curly-spacing */
const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

// ✅ GET /transactions
exports.transactions = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection("transactions").get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ✅ POST /addTransaction
exports.addTransaction = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      const { amount, type, date } = req.body;

      if (!amount || !type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const docRef = await admin.firestore().collection("transactions").add({
        amount,
        type,
        date: date || new Date().toISOString()
      });

      res.status(201).json({
        message: "Transaction added",
        id: docRef.id
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ✅ DELETE /deleteTransaction?id=123
exports.deleteTransaction = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "DELETE") {
        return res.status(405).send("Method Not Allowed");
      }

      const id = req.query.id;

      if (!id) {
        return res.status(400).json({ error: "Missing ID" });
      }

      await admin.firestore().collection("transactions").doc(id).delete();

      res.status(200).json({ message: "Deleted successfully" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});