const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: { type: String, require: true, },
    username: { type: String, require: true, unique: true, },
    password: { type: String,},
    email: { type: String, require: true, unique: true, },
    googleProviderId:{type:String},
    githubProviderId:{type:String},
    providerName:{type:String},
    contact: { type: String,  },
    gender: { type: String, },
    address: { type: String, },
    DOB: { type: Date, },
    profileImage: { type: String },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    adoptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }]
}, { timestamps: true });

module.exports = mongoose.model('user', UserSchema);