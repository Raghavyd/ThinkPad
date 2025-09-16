import axios from 'axios';
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import ReactMarkdown from "react-markdown";
const NoteDetailPage = () => {
  const [save,setSave] = useState(false)
  const [loading ,setLoading] =useState(false);
   const [aiResult, setAiResult] = useState("");
  const [note,setNote] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const {id} =useParams();


  useEffect(()=>{
    const fetchNotes=async()=>{
      try {
        setLoading(true)
        const res =await axios.get(`http://localhost:5001/api/notes/${id}`)
        setNote(res.data)
      } catch (error) {
          console.log("error in fetching notes",error);
          toast.error("failed to fetch the notes");      
      } finally{
        setLoading(false)
      }
    }
    fetchNotes();
  },[id])

  const handleDelete = async()=>{
    if(!window.confirm("are you sure ?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/notes/${id}`)
      toast.success("note deleted");
      navigate("/")
    } catch (error) {
      console.log("error deleting the notes",error);
      toast.error("failed to delete notes");
    }
  }
  const handleSave = async () => {
  if (!note.title.trim() || !note.content.trim()) {
    toast.error("please add title or content");
    return;
  }

  setSave(true);
  try {
    await axios.put(`http://localhost:5001/api/notes/${id}`, {
      title: note.title,
      content: note.content,
    });

    toast.success("Note updated");
    navigate("/");
  } catch (error) {
    console.error("Error updating the note", error);
    toast.error("Failed to update note");
  } finally {
    setSave(false);
  }
};

 const handleAIGenerate = async () => {
  setLoading(true);
  try {
    const response = await axios.post("http://localhost:5001/api/notes/ai/generate", {
      text: note.content,
    });

    setAiResult(response.data.output);
  } catch (err) {
    console.error("AI generation failed", err);
    toast.error("AI generation failed");
  } finally {
    setLoading(false);
  }
};


  if(loading){
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <LoaderIcon className='animate-spin size-10'/>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-base-200 '>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto '>
          <div className='flex items-center justify-between mb-6'>
            <Link to={"/"} className='btn btn-ghost'>
            <ArrowLeftIcon className='h-5 w-5'/>
            Back to Notes
            </Link>
            <button onClick={handleDelete} className='btn btn-error btn-outline'>
              <Trash2Icon className='h-5 w-5' /> Delete Notes
               </button>
          
          </div>
          <div className='card bg-base-100'>
            <div className="card-body">
              
              {/* Title */}
              <div className="form-control mb-4">
                <label htmlFor="title" className="label  mb-2">
                  <span className="label-text font-medium">Title</span>
                </label>


                <input
                 
                  type="text"
                 
                  placeholder="Note-title"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  value={note.title}
                  onChange={(e) => setNote({...note,title: e.target.value})}
                 
                />
              </div>

              {/* Content */}
              <div className="form-control mb-6">
                <label htmlFor="content" className="label mb-2">
                  <span className="label-text font-medium">Content</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered w-full h-40 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  value={note.content}
                  onChange={(e) => setNote({...note,content:e.target.value})}
                  
                />
              </div>

              {/* Button */}
             <div className="card-actions justify-between">
                <button className="btn btn-primary" disabled={save} onClick={handleSave}>
                  {save ? "Saving..." : "Save Changes"}
                </button>
             {/* New AI Button */}
        <button
          onClick={handleAIGenerate}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
          disabled={loading}
        >
          {loading ? "Generating..." : "Ask AI"}
        </button>
      </div>

      {/* AI Result Display */}
      {aiResult && (
        <div className="mt-6 p-4 bg-gray-900 text-gray-100 rounded-2xl shadow-lg border border-gray-700">
    <h2 className="text-xl font-bold text-green-400 mb-4">✨ AI Suggestions</h2>
   <ReactMarkdown
  components={{
    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-1 text-green-400" {...props} />,
    p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
    li: ({node, ...props}) => <li className="list-disc list-inside ml-4" {...props} />,
  }}
>
  {aiResult}
</ReactMarkdown>

  </div>
      )}
    
            </div>
          </div>
        </div>
      </div>
      </div>
    
  )
}

export default NoteDetailPage
