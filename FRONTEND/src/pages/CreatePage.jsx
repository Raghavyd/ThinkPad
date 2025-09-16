import axios from 'axios'
import { ArrowLeftIcon } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router'

const CreatePage = () => {
  const [title,setTitle] =useState("")
  const [content,setContent] = useState("")
  const [loading,setLoading] = useState(false)
 const navigate = useNavigate()

  const  handleSubmit= async(e)=> {
    e.preventDefault();

    if(!title.trim() || !content.trim()){
      toast.error("All field are required");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/notes",{
        title,
        content
      } )
      toast.success("Note Created Successfully")
      navigate("/")
    } catch (error) {
      console.log("error creating notes",error);
      if(error.response.status===429){
        toast.error("slow down!!!!!!!!!",{
          duration:4000
        })
      } else toast.error("failed to create notes")
      
      
    }
    finally{
      setLoading(false);
    }
  }
  return  (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Back Button */}
        <Link to="/" className="btn btn-ghost mb-6 flex items-center gap-2">
          <ArrowLeftIcon className="size-5" />
          Back to Notes
        </Link>

        {/* Card */}
        <div className="card bg-base-100/90 shadow-xl rounded-xl backdrop-blur-md">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold mb-6">Create New Note</h2>

            <form onSubmit={handleSubmit} className="space-y-6 ">
              {/* Title */}
              <div className="form-control mb-10">
                <label htmlFor="title" className="label  mb-2">
                  <span className="label-text font-medium">Title</span>
                </label>


                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter a title..."
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
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
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Note"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
