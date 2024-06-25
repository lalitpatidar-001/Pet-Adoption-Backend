const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, required: true,ref:"user"},
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    price: { type: Number },
    isNoFee: { type: Boolean, default: false },
    image: {type:String,},
    status:{ type:String,
        default:"Available",
        enum:["Adopted","Available"]
    },
    location:{ type:String},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
},{timestamps:true});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
