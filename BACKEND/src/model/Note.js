import mongoose from "mongoose";
// 1. create schema
// 2.  model based off that schema

const noteSchema =new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    content:{
        type:String,
        require:true,
    },
    aiSuggestions:{
        type:String,
        require:true,
    }
},
{timestamps:true} //createdAt, updatedAT
)

const Note =mongoose.model("Note",noteSchema)
export default Note