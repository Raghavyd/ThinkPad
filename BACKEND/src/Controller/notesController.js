import Note from "../model/Note.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config(); 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
import mongoose from "mongoose";
export async function  getAllNotes (req,res){
   try {
    const notes =await Note.find().sort({createdAt:-1})
    res.status(200).json(notes)
   } catch (error) {
    console.error("error in getAllNotes controller",error)
    res.status(500).json({message:"internal server error"})
    
   }
}
export async function getNoteById(req,res){
   try {
    const notes = await Note.findById(req.params.id)
     if(!notes){
       return res.status(404).json({message:"note not found"})
    } 
   res.status(200).json(notes)
   } catch (error) {
    console.error("error in getAllNotes controller",error)
    res.status(500).json({message:"internal server error"})
    
   }
}

export async function createNotes(req,res){
    try {
    const {title,content} =req.body
    const newNote=new Note({title,content})

   const savedNote= await newNote.save();
    res.status(201).json(savedNote)
   } catch (error) {
    console.error("error in createnotes controller",error)
    res.status(500).json({message:"internal server error"})
    
   }
}

export async function updateNotes(req, res) {
  try {
    const { title, content } = req.body;

    const updatedNotes = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedNotes) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNotes,
    });
  } catch (error) {
    console.error("error in updateNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function generateAI(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    The user has this idea: "${text}".
    Expand it into:
    - A brief research summary
    - Possible roadmap steps
    - Challenges and opportunities
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ output: response.text() });
  } catch (error) {
    console.error("Error in AI generation:", error);
    res.status(500).json({ message: "AI generation failed" });
  }
}

export async function deleteNotes(req,res){
   try {
    const deletedNote =await Note.findByIdAndDelete(req.params.id)
    if(!deleteNotes){
       return res.status(404).json({message:"note not found"})
    } 
     res.status(200).json({message:"note deleted successfully"})
   } catch (error) {
     console.error("error in delete controller controller",error)
        res.status(500).json({message:"internal server error"})
   }
}