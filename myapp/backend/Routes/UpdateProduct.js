const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const auth = require("../middleware/auth");
router.put("/update-product/:id", auth, async (req, res) => {
    const id = req.params.id;
    const updatedLevels = { ...req.body.levels };
delete updatedLevels._id; // ✅ Remove the immutable _id

    console.log("▶️ update-product called");
    console.log("ID:", id);
    console.log("Received Levels:", updatedLevels);

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    if (!updatedLevels || typeof updatedLevels !== "object" || Object.keys(updatedLevels).length === 0) {
        return res.status(400).json({ success: false, message: "No valid update data provided" });
    }

    try {
        const collection = mongoose.connection.db.collection("stock_item_new");

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedLevels }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "No changes made or item not found" });
        }

        res.json({ success: true, message: "Item updated successfully" });
    } catch (err) {
        console.error("❌ Update Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
module.exports = router;