const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const generateJWTToken = require("../utils/jwtToken");

// create new user - done
const registration = async (req, res) => {
  const user = req.body;
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists)
      return res.status(401).json("username already exists, choose new ");
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(401).json("email already exists");

    const salt = bcrypt.genSaltSync(10);
    if (req.body.password)
      user.password = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User(user);
    const savedUser = await newUser.save();
    const { password, ...others } = savedUser;
    return res.status(201).json(others._doc);
  } catch (error) {
    console.log(error);
    return res.status(500).json("somthing went wrong on server");
  }
};

//  login  user
const login = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists)
      return res.status(404).json({ msg: "wrong email or password" });

    const isPasswordCorrect = bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (!isPasswordCorrect)
      return res.status(401).json({ msg: "wrong password" });
    let token = null;
    try {
      token = await generateJWTToken({ id: userExists._id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "something went wron in login" });
    }

    const { password, ...others } = userExists;
    const sendData = others._doc;
    res.cookie("auth-token", token, { httpOnly: true, samesite: true });
    return res.status(200).json({ msg: "authentic user", sendData });
  } catch (error) {
    res.status(500).json("something went wrong on server");
    console.log("error ", error);
  }
};

const loginSuccess = (req, res) => {
  if (req.user && req.user !== null && req.user !== undefined) {
      res.cookie("auth-token",req.user.token,{httpOnly:true,samesite:true});
    return res.status(200).json(req.user.user);
  } else {
    return res.status(401).json({ msg: "user not logged in" });
  }
};

const loginFailed = (req, res) => {
  console.log("login failed");
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: "Logout failed", error: err });
    }
    req.session.destroy(); // Ensure session is destroyed
    console.log("logout", req.user);
    return res.status(200).json({ message: "Logout Successfull" });
  });
};

const OAuthUserLoginOrRegister = async (data) => {
  try {
    const { providerId, username, provider, displayName, photo, email } = data;
    console.log("photo ",photo);
    const userExists = await User.findOne({email:email});
    if(userExists) return userExists;

    const newUser = new User({
      fullname:displayName,
      username :username,
      email:email,
      googleProviderId:providerId,
      profileImage:photo,
      providerName:provider
    })

    const savedUser = await newUser.save();
    const payload = {
      id:savedUser._id,
    }
    const user = {
      email:savedUser.email,
      _id:savedUser._id,
    }
    const token  = await generateJWTToken(payload);
    return({token,user})
  } catch (error) {
    console.log(error);
    return error;
  }
};


module.exports = {
  registration,
  login,
  loginSuccess,
  logout,
  loginFailed,
  OAuthUserLoginOrRegister,
};
