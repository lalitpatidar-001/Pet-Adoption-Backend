const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        chatId:{
            type:mongoose.Schema.ObjectId,
            ref:"chat"
        },
        to: {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        },
        from: {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        },
        type: {
            type: String,
            enum: ["Text", "Image", "Document", "Link"]
        },
        text: {
            type: String
        },
        image: {
            type: String
        },
        status:{
            type:String,
            enum:["Read","Delivered","Sent","Pending"],
            default:"Delivered"
        }
    },
    { timestamps: true });

module.exports = mongoose.model("message", MessageSchema);