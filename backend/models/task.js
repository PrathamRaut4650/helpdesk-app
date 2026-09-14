const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","in-progress","completed"],
        default:"pending"
    },
    priority:{
        type:String,
        enum:["low", "medium", "high"],
        default:"medium"
    },
       assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})
module.exports = mongoose.model("task", taskSchema)