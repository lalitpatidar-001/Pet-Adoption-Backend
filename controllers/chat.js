const Chat = require("../models/Chat");

const createNewChat = async(req,res)=>{
    const {memberOne,memberTwo} = req.body;
    //TODO validate data
    console.log(memberOne,memberTwo);

    const existedChat = await Chat.findOne({participants:{$all:[memberOne,memberTwo]}}).populate("participants")
    if(existedChat){
        return res.status(200).json({message:"chat already exist",data:existedChat})
    }
    const newChat = new Chat({
        participants:[memberOne,memberTwo]
    })
    try{    
        const savedChat = await newChat.save();
        return res.status(201).json({message:"new chat created successfully",data:savedChat});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"internal server error"});
    }
}


const getAllChatsOfUser = async (req,res)=>{
    const {userId} = req.params;
    try{
        const chats = await Chat.find({participants:{$in:[userId]}}).populate("participants");
        return res.status(200).json({message:"all chats retrieved successfully",data:chats})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"internal server error"});
    }
} 

module.exports = {
    createNewChat,
    getAllChatsOfUser
}