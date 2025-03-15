const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
    details:{
        type:String,
        required:true
    },
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})
const threadSchema = mongoose.Schema({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
},{timestamps:true})
const Thread = mongoose.model("Thread",threadSchema);
const Message = mongoose.model("Message",messageSchema);
module.exports = {Thread,Message};