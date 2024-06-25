const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "user"
            }
        ],
        lastMessage: {
            type: mongoose.Schema.ObjectId,
            ref: ""
        }
    },
    { timestamps: true });

module.exports = mongoose.model("chat", ChatSchema);