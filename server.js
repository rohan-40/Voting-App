const express = require('express');
const app = express();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.listen(3000,()=>{
    console.log("Listing to port 3000");
})