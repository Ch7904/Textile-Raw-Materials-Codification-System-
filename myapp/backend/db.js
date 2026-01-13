const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://sioen:Krishna091004@cluster0.dggybaw.mongodb.net/sioenmern?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    const fetched_data = await mongoose.connection.db.collection("stock_item_new");
    const data = await fetched_data.find({}).toArray()
    global.stock_item = data
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = mongoDB;
