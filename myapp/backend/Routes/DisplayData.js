const express = require('express')
const router = express.Router()
router.post('/stockData',(req,res)=>{
    try {
        res.send([global.stock_item])
    } catch (error) {
        console.error(error.message);
        res.send("Server Error")
    }
})
module.exports = router;