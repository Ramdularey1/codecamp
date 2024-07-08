import mongoose, {Schema} from "mongoose";


const testCaseSchema = new Schema({
     input:{
        type:String,
        require:true
     },
     output:{
        type:String,
        require:true
     }
})

const problemSchema = new Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true
    },
    difficulty:{
        type:String,
        enum: ["Easy","Medium","Hard"],
        require:true
    },
    testCases:[testCaseSchema]

}, {timestamps:true});

const Problem = mongoose.model("problem", problemSchema);
export default Problem;