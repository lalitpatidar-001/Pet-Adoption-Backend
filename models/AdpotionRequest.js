const mongoose = require('mongoose');

const AdoptionRequestSchema = new mongoose.Schema({
    pet:{
        type:mongoose.Schema.ObjectId,
        ref:"post"
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },
    requester:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","adopted","cancel","denied"]
    }
}, { timestamps: true });

module.exports = mongoose.model('AdoptionRequest', AdoptionRequestSchema);