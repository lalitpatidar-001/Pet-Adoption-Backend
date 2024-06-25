const router = require('express').Router();
const {saveTextMessage, getAllMessageOfChat, saveImageMessage} = require("../controllers/message");
const { uploadMessageImage } = require('../utils/multer');

router.post("/text-message/:userId",saveTextMessage);
router.post("/image-message/:userId",uploadMessageImage.single("messageImage"),saveImageMessage);
router.get("/all-messages/:chatId",getAllMessageOfChat);



module.exports = router;