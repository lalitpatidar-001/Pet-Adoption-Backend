const Message = require("../models/Message");

const saveTextMessage = async (req, res) => {
    const { userId } = req.params;
    const { chatId, to, type, text } = req.body;

    const newTextMessage = new Message({
        chatId,
        from: userId,
        to,
        type,
        text
    });
    try {
        const savedTextMessage = await newTextMessage.save();
        return res.status(201).json({ messaeg: "text message saved", data: savedTextMessage });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}

const saveImageMessage = async (req, res) => {
    console.log("image", req.file);
    const { userId } = req.params;
    const { chatId, to, type } = req.body;
    console.log( chatId, to, type )
    if (!req.file) {
        return res.status(404).json({ message: "file not found" });
    }
    const filePath = req.file.path?.replace(/\\/g, '/');
    try {
        const newImageMessage = new Message({
            chatId,
            from: userId,
            to,
            type,
            image:filePath,
        });

        const savedImageMessage = await newImageMessage.save();
        return res.status(201).json({message:"image message saved successfully",data:savedImageMessage})
    } catch (error) {
        console.log(error);
    }
    return res.status(200).json({ message: "ran" })
}

const getAllMessageOfChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await Message.find({ chatId });
        return res.status(200).json({ message: "all messages retireved", data: messages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}
module.exports = {
    saveTextMessage,
    getAllMessageOfChat,
    saveImageMessage
}