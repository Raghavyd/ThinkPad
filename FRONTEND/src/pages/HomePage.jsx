import React from 'react'
import Navbar from '../Components/Navbar'
import toast from 'react-hot-toast'
import RateLimitedUI from '../Components/RateLimitedUI'
import { useState } from 'react'
import { useEffect } from 'react'
import api from '../lib/axios'
import axios from 'axios'
import NoteCard from '../Components/NoteCard'
import NotesNotFound from '../Components/NotesNotFound'
const HomePage = () => {
     const [isRateLimited,setIsRateLimited] =useState(false)
    const [notes,setNotes]=useState([])
    const [loading,setLoading] =useState(true)
    useEffect(() => {
    const fetchNotes = async () => {
     try {
  const res = await api.get("/notes");
  if (Array.isArray(res.data)) {
    setNotes(res.data);
  } else {
    console.error("Unexpected response:", res.data);
    setNotes([]); // prevent .map crash
  }
  setIsRateLimited(false);
} catch (error) {
  if (error.response?.status === 429) {
    setIsRateLimited(true);
    setNotes([]); // important
  } else {
    toast.error("Failed to load notes");
    setNotes([]);
  }
} finally {
  setLoading(false);
}

    };

    fetchNotes();
  }, []);
  return (
   
    <div >
        
       <div className='min-w-full'>
        <Navbar/>
       {isRateLimited && <RateLimitedUI/>} 
       <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading &&  <div className='text-center text-primary py-10'>Loading notes...</div>}
        {notes.length==0 && !isRateLimited && <NotesNotFound/>}
        {notes.length>0 && !isRateLimited &&(<div className='grid grid-cols-1 md:grid-cols-2
        lg:grid-cols-3 gap-6'>
          {notes.map((note)=>(
            <NoteCard key={note._id} note={note} setNotes={setNotes} />
          ))}
          </div>)}
       </div>
       </div>
    </div>
  )
}

export default HomePage
