const router = require('express').Router();
const {createNewChat, getAllChatsOfUser} = require("../controllers/chat")

router.post("/create-chat",createNewChat);
router.get("/all-chats/:userId",getAllChatsOfUser)


module.exports = router;