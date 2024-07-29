import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userrouter from "./Router/User.router.js"
import connectDb from "./Database/Dbconfig.js"
dotenv.config()

const app=express()
app.use(cors())
app.use(express.json())
connectDb()

app.get("/",(req,res)=>{
    res.status(200).send("app is working ")
})


app.use("/api/user",userrouter)
app.listen(process.env.port,()=>
{
    console.log("app is listenning to the port,", process.env.port)
})
