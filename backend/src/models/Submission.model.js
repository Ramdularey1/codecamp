import mongoose, {Schema} from "mongoose";

const submissionSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    problem:{
         type:Schema.Types.ObjectId,
         ref:'Problem',
         require:true
    },
    source_code: {
         type: String,
          required: true 
        },
    language_id: {
         type: Number, 
         required: true 
        },
        result: {
            status: { type: String },
            stdout: { type: String },
            stderr: { type: String },
            compile_output: { type: String },
          },
}, {timestamps:true});

const Submission = mongoose.model('submission', submissionSchema);
export default Submission;