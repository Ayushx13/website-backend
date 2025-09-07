import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'Please provide the candidate name!']
    },

    category:{
        type:String,
        required:[true , 'Please provide the category!']
    },

    vote:{
        type:Number,
        default:0,
    }
});

const Candidate = mongoose.model("Candidate",candidateSchema);
export default Candidate ;