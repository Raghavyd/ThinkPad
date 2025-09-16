import { PenSquare, Trash2Icon } from "lucide-react"
import { Link } from "react-router"
import { formatDate } from "../lib/utils"
import axios from "axios"
import toast from "react-hot-toast"

const  NoteCard =({note,setNotes})=>{
    const handleDelete =async(e,id)=>{
        e.preventDefault();
        if(!window.confirm("Delete this?")) return
        try {
            await axios.delete(`http://localhost:5001/api/notes/${id}`)
            setNotes((prev)=> prev.filter((note)=>note._id != id)) ///get rid of deleted noted.ui turant update after deletion
            toast.success("Notes Deleted Successfully");
        } catch (error) {
            console.log("error in handleDelete",error);
            toast.error("failed to delete Notes");
            
        }
    }
    return (
    <Link to={`/note/${note._id}`}
    className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid 
    border-[#00ff9d] ">
        <div className="card-body">
            <h3 className="card-title text-base-content ">{note.title}</h3>
            <p className="text-base-content/70 line-clamp-3">{note.content}</p>
            <div className="card-actions justify-between items-center mt-4">
                <span>{formatDate( new Date(note.createdAt)) }</span>
                <div className="flex items-center gap-1">
                    <PenSquare className="size-4"/>
                    <button className="btn btn-ghost btn-xs text-error">
                        <Trash2Icon className="size-4" onClick={(e)=>handleDelete(e,note._id)}/>
                    </button>
                </div>
            </div>
        </div>
    
    </Link>
    )
}
export default NoteCard
