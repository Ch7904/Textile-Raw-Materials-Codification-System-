const mongoose = require("mongoose");
const readline = require("readline");

const mongoURI = "mongodb+srv://sioen:@cluster0.dggybaw.mongodb.net/sioenmern?retryWrites=true&w=majority&appName=Cluster0";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mongoose.set("strictQuery", false);

const run = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");

    const collection = mongoose.connection.db.collection("stock_item");

    rl.question("Enter all parameters (comma separated):\n", async (input) => {
      const params = input.split(",").map(s => s.trim().toUpperCase());

      const allCategories = await collection.find({}).toArray();

      let resultCode = null;

      for (const categoryDoc of allCategories) {
        const level1 = categoryDoc.level1?.toUpperCase();

        // ADHESIVE TAPE-style structure
        if (categoryDoc.items?.[0]?.side && categoryDoc.items?.[0]?.sizes) {
          if (params.length < 4) continue;

          const [inputLevel1, side, size, supplier] = params;
          if (inputLevel1 !== level1) continue;

          const matchedItem = categoryDoc.items.find(item =>
            item.side.toUpperCase() === side &&
            item.sizes.some(s => s.size.toUpperCase() === size)
          );

          const supplierMatch = categoryDoc.level10.find(s =>
            s.description.toUpperCase() === supplier
          );

          if (matchedItem && supplierMatch) {
            const sizeCode = matchedItem.sizes.find(s =>
              s.size.toUpperCase() === size
            ).code;
            resultCode = `${matchedItem.type}${sizeCode}${supplierMatch.code}`;
            break;
          }
        }

        // BUCKLE-style structure
        else if (categoryDoc.items?.[0]?.function && categoryDoc.items?.[0]?.options) {
          if (params.length < 3) continue;

          const [func, ...rest] = params;
          const supplier = rest.pop();
          const optionCodes = rest;

          const matchedItem = categoryDoc.items.find(item =>
            item.function.toUpperCase() === func &&
            optionCodes.every((code, i) => {
              const levelKey = `level${i + 3}`;
              return item.options[levelKey]?.some(opt =>
                opt.code.toUpperCase() === code
              );
            })
          );

          const supplierMatch = categoryDoc.level10.find(s =>
            s.description.toUpperCase() === supplier
          );

          if (matchedItem && supplierMatch) {
            const optionString = optionCodes.map((code, i) =>
              matchedItem.options[`level${i + 3}`]
                .find(opt => opt.code.toUpperCase() === code).code
            ).join('');
            resultCode = `${matchedItem.type}${optionString}${supplierMatch.code}`;
            break;
          }
        }
      }

      if (resultCode) {
        console.log("✅ Result Code:", resultCode);
      } else {
        console.log("❌ No matching item found in any category");
      }

      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
