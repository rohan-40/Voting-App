const mongoose = require('mongoose')
const MongoURL = 'mongodb://localhost:27017/Vote'

mongoose.connect(MongoURL,
);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to MongoDb");
})

db.on('error',(err)=>{
    console.log("Internal Error: ",err);
})

db.on('disconnected',()=>{
    console.log("Disconnected from MongoDb");
})

module.exports = db;