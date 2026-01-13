const mongoose = require("mongoose");
const readline = require("readline");

const mongoURI = "mongodb+srv://sioen:Krishna091004@cluster0.dggybaw.mongodb.net/sioenmern?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", false);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const normalize = (val) => val?.trim().toUpperCase();
const isValid = (val) => val && val !== "NA" && val !== "";

const run = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");

    const collection = mongoose.connection.db.collection("stock_item_new");

    rl.question("Enter up to 9 levels (comma separated):\n", async (input) => {
      const inputLevels = input.split(",").map(normalize).filter(isValid);

      const allDocs = await collection.find({}).toArray();

      const foundCodes = [];

      for (const userInput of inputLevels) {
        let matchedCode = null;

        for (const doc of allDocs) {
          for (let level = 1; level <= 9; level++) {
            const levelKey = `LEVEL ${level}`;
            const codeKey = `${level}_Code`;

            if (normalize(doc[levelKey]) === userInput) {
              matchedCode = (doc[codeKey] || "").toString().trim();
              break;
            }
          }
          if (matchedCode) break; // Stop searching if match found
        }

        if (matchedCode) {
          foundCodes.push(matchedCode);
        }
      }

      if (foundCodes.length > 0) {
        const finalCode = foundCodes.join("");
        console.log("✅ Result Code:", finalCode);
      } else {
        console.log("❌ No matching codes found");
      }

      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

run();
