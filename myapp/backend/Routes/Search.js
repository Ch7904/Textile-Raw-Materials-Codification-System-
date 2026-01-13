const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/search", async (req, res) => {
    const { field, value, matchType } = req.body;

    if (!field || !value) {
        return res.status(400).json({ success: false, message: "Missing field or value" });
    }

    try {
        const collection = mongoose.connection.db.collection("stock_item_new");

        // Build dynamic query
        const query = {};
        // case-insensitive match
        
        if (matchType === "exact") {
            query[field] = { $regex: `^${value}$`, $options: "i" };
          } else {
            query[field] = { $regex: value, $options: "i" };
          }
          
        const result = await collection.find(query).toArray();

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "No matching documents found" });
        }

        res.json({ success: true, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
