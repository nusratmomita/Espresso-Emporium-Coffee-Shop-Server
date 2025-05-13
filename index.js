const express = require('express');
const cors = require('cors');
const app = express();
const port  = process.env.PORT || 3000;

app.use(cors());// to have access from other port 
app.use(express.json());// to able to use json data

// root 
app.get('/',(req,res)=>{
    res.send("Coffee is getting ready to warm to up!")
})

// listing to the port
app.listen(port , ()=>{
    console.log(`Coffee server is listing to port "${port}"`);
})

