const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const passport = require("passport")
const session = require('express-session');
require("dotenv").config();
require("./auth_config/passport")
const app = express();

// router imports
const authRouter = require('./routers/auth');
const postRouter = require('./routers/post');
const userRouter = require('./routers/user');
const adoptionRequestRouter = require('./routers/adoptionRequest');
const chatRouter = require('./routers/chat');
const messageRouter = require('./routers/message');

// Middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Credentials",true);
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  next()
})

app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a random string used to sign the session ID cookie
  resave: false,
  saveUninitialized: false,
}));


app.use(cors({
  origin: "http://localhost:5173",
  // credentials: true,
  // optionsSuccessStatus: 200,
}));

app.use(passport.initialize());
app.use(passport.session());
// create socket server 
const server = new http.createServer(app);
// socket config
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    // credentials: true,
  }
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/profiles', express.static(path.join(__dirname, 'profiles')));
app.use('/messageImages', express.static(path.join(__dirname, 'messageImages')));

// routers
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);
app.use("/api/adoption-request", adoptionRequestRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);



// DB config
mongoose.connect(process.env.DB_URL)
  .then(() => console.log("DB Connected."))
  .catch(error => console.log("DB error", error));

// Initialize an empty onlineUsers object
const onlineUsers = {};

// Function to add a key-value pair to the onlineUsers
function putUser(key, value) {
  onlineUsers[key] = value;
}

// Function to get the value associated with a key from the onlineUsers
function getUser(key) {
  return onlineUsers[key];
}

// Function to remove a key-value pair from the onlineUsers
function removeUser(key) {
  if (key in onlineUsers) {
    delete onlineUsers[key];
    console.log(`Key '${key}' has been removed from the onlineUsers.`);
  } else {
    console.log(`Key '${key}' does not exist in the onlineUsers.`);
  }
}

// socket event listeners
io.on("connection", (socket) => {
  console.log("user connected");
  console.log("socket Id ", socket.id)
  const user_id = (socket.handshake.query["user_id"]); // connected user's id

  if (Boolean(user_id)) {
    putUser(user_id, socket.id);
  }
  console.log(onlineUsers);

  socket.on("sent_new_message", (data) => {
    console.log("message", data);
    const { to, from } = data;
    console.log("to", to)
    const to_user_socketId = getUser(to);
    console.log(to_user_socketId)
    if (to_user_socketId) {
      console.log("called")
      io.to(to_user_socketId).emit("new_message_arrived", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    // Assuming you store user_id in socket object
    const user_id = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
    if (user_id) {
      removeUser(user_id);
    }
    console.log(onlineUsers);
  });

});

// server config
server.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});









