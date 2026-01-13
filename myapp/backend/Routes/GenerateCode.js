const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const normalize = (val) => val?.trim().toUpperCase();
const isValid = (val) => val && val !== "NA" && val !== "";

router.post("/generate-code", async (req, res) => {
  try {
    const inputLevels = (req.body.levels || []).map(normalize).filter(isValid);

    if (inputLevels.length === 0) {
      return res.status(400).json({ success: false, message: "No valid input levels provided" });
    }

    const collection = mongoose.connection.db.collection("stock_item_new");
    const allDocs = await collection.find({}).toArray();

    const foundCodes = [];

    for (const userInput of inputLevels) {
      let matchedCode = null;

      for (const doc of allDocs) {
        for (let level = 1; level <= 10; level++) { // MUST go up to LEVEL 10
          const levelKey = `LEVEL ${level}`;
          const codeKey = `${level}_Code`;

          if (normalize(doc[levelKey]) === userInput) {
            matchedCode = (doc[codeKey] || "").toString().trim();


            break;
          }
        }
        if (matchedCode) break;
      }

      if (matchedCode) {
        foundCodes.push(matchedCode);
      }
    }

    if (foundCodes.length > 0) {
      const finalCode = foundCodes.join("");
      return res.json({ success: true, code: finalCode });
    } else {
      return res.json({ success: false, message: "No matching code found" });
    }
  } catch (err) {
    console.error("❌ Error generating code:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
