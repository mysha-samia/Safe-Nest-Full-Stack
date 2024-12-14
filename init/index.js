//logic of the initialization database
const mongoose = require("mongoose");
const initData = require("./data.js");
//we will require the models from the listing.js
const Listing = require("../models/listing.js");


//connecting to the database
// const databaseURL= "mongodb://127.0.0.1:27017/wanderlust"
const databaseURL ="mongodb+srv://2020952:3WEkJKmzzGvZBw64@cluster0.24xqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//connecting the database
//for database we will create an async function

async function main(){
  await mongoose.connect(databaseURL);
}
//calling the main function
main().then(()=>{
console.log("database is connected")
}).catch ((err)=>{
  console.log("error is ctached");
});

//initializing the database
const initDB = async()=>{
    await Listing.deleteMany({});
   //inside init data we have a data array
   //we will access that array through map function in each object
   //for each object we would set the object id value
   //to have all the properties of the object we would use {...} spread operator
   //then individual object e we will add a new property owner id;
   //we are converting the object into a new object
   //map function will create a new array. we will store the new array in another vairable

 initData.data= initData.data.map(
  (obj)=>({...obj, owner:"674e8f66e544bc49b12105ef"}));

    //here data is an object
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

};
initDB();
