import express from "express";
import notesRoute from "./routes/notesRoute.js";
import cors from "cors"
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"
import rateLimiter from "./middleware/rateLimiter.js";
import path from "path"
dotenv.config();
// console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();
const PORT=process.env.PORT ||5001
const __dirname=path.resolve()
//middleware
if(process.env.NODE_ENV !=="production"){
app.use(cors({
    origin:"http://localhost:5173"
}))
}

app.use(express.json()); //this middleware  will parse json bodies

app.use(rateLimiter);
connectDB();
app.use("/api/notes",notesRoute);

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
})
}

app.listen(PORT,()=>{
    console.log("server started on port: ",PORT);
})


//mongodb+srv://amankumar900651_db_user:GXMIaaOwqU2GTQTv@cluster0.ztrqbft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0