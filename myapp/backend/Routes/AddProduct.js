const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


router.post("/add-product", async (req, res) => {
  try {
    const levels = req.body.levels || {};
    const doc = {};

    for (let i = 1; i <= 9; i++) {
      const levelKey = `LEVEL ${i}`;
      const codeKey = `${i}_Code`;
      doc[levelKey] = levels[levelKey] || "";
      doc[codeKey] = levels[codeKey] || "";
    }

    const collection = mongoose.connection.db.collection("stock_item_new");
    await collection.insertOne(doc);
    res.json({ success: true, message: "Product added successfully" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/get-all-levels", async (req, res) => {
    const collection = mongoose.connection.db.collection("stock_item_new");
    const docs = await collection.find({}).toArray();
  
    const levels = {};
  
    for (let i = 1; i <= 10; i++) {
      const levelKey = `LEVEL ${i}`;
      levels[i] = [...new Set(docs.map(doc => doc[levelKey]).filter(Boolean))];
    }
  
    res.json({ success: true, levels });
  });
  

module.exports = router;
