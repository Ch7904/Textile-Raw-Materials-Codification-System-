const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
app.use(cors());
const mongoDB = require("./db")
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})
mongoDB();
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(express.json())
app.use('/api',require("./Routes/CreateUser"));
app.use('/api',require("./Routes/GenerateCode"));
app.use('/api',require("./Routes/AddProduct"));
app.use('/api',require("./Routes/DisplayData"));
app.use('/api',require("./Routes/DeleteProduct"));
app.use('/api',require("./Routes/UpdateProduct"));
app.use('/api',require("./Routes/Search"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
