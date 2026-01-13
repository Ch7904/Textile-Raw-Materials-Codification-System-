const XLSX = require("xlsx");
const path = require("path");
const connectToMongo = require("./db");
const mongoose = require("mongoose");

const sheetToMongo = async () => {
  try {
    await connectToMongo();

    const filePath = path.join(__dirname, "..", "data", "Material Structure Codification.xlsx");
    const workbook = XLSX.readFile("C:\\Users\\Chidam\\Desktop\\SIOEN\\myapp\\data\\Material Structure Codification.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Step 1: Get raw rows
    const rawRows = XLSX.utils.sheet_to_json(sheet, {
      header: 1, // Get raw 2D array
      defval: "",
    });

    const headers = rawRows[1]; // Use 2nd row as headers (adjust if needed)
    const dataRows = rawRows.slice(2); // Data starts after header

    // Step 2: Clean and structure data
    const cleanedData = dataRows.map((row) => {
      const entry = {};
      headers.forEach((header, idx) => {
        const key = header?.trim() || `COL_${idx}`;
        entry[key] = row[idx] ?? "";
      });
      return entry;
    });

    // Step 3: Insert into MongoDB
    const collection = mongoose.connection.db.collection("trial");
    await collection.deleteMany({}); // Optional: Clear previous data
    await collection.insertMany(cleanedData);

    // Step 4: Query "LEVEL 2" items for "ADHESIVE TAPE" in "LEVEL 1"
    const level2Items = await collection.find({
      "LEVEL 1": "ADHESIVE TAPE"
    }).project({ "LEVEL 2": 1, _id: 0 }).toArray();

    console.log("Level 2 items of ADHESIVE TAPE:", level2Items);
    console.log("Excel data inserted into MongoDB successfully");

  } catch (err) {
    console.error("Error processing Excel:", err);
  } finally {
    mongoose.connection.close(); // Always close the connection
  }
};

sheetToMongo();
