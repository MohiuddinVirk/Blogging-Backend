const express = require("express")
const mongoose  =require("mongoose")
const app = express();
const user = require("./models/User.schema");
const Userrouter = require("./Routes/UserRoutes");
const Blogrouter = require("./Routes/BlogRoutes");
app.use(express.json())
const cors = require("cors")
require("dotenv").config()
app.listen(3000)
app.use(cors({
    origin:'*'
}))

app.use("/user" ,  Userrouter)
app.use("/blog" ,  Blogrouter)

app.get("/" , (req , res)=>{
    res.json({"Meesage":"Hello"})
})

mongoose.connect(process.env.MONGODB_STRING).then(()=>{
    console.log("Connected")
}).catch(err=>{
    console.log(err)
})
