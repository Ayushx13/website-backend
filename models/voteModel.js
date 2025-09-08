import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },

    user_name: {
        type: String,   
        required: true
    },

    candidate:{
        type: mongoose.Schema.ObjectId,
        ref:"Candidate",
        required: true
    },

    
    category:{
        type:String,
        require:[true , 'category required for vote!']
    }
})

// Prevent duplicate vote in same category
voteSchema.index({ user: 1, category: 1 }, { unique: true });


const Vote = mongoose.model("Vote",voteSchema);
export default Vote ;