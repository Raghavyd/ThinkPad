import express from 'express';
import { createNotes, deleteNotes, generateAI, getAllNotes, getNoteById, updateNotes } from '../Controller/notesController.js';

const router = express.Router();
router.get("/",getAllNotes);
router.post("/",createNotes);
router.post("/ai/generate", generateAI);
router.get("/:id",getNoteById);

router.put("/:id",updateNotes);
router.delete("/:id",deleteNotes);

export default router;