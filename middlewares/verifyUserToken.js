const jwt = require("jsonwebtoken");
const verifyUserToken = (req, res, next) => {
  const token = req.cookeis["auth-token"];
  if (!token) return res.status(404).json({ msg: "token not found" });
  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error("JWT Secret key not defined");

    const options =  {
        issuer:process.env.JWT_ISSUER,
        audience:process.env.JWT_AUDIENCE,
        algorithm:process.env.JWT_ALGORITHM,
    }
        jwt.verify(token,secret,options,(err,decoded)=>{
            if(err) return res.status(401).json({msg:"Unauthorized user , invalid token"});
            req.userId = decoded.id;
            console.log(userId);
            next();
        });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "something went wrong in authentication." });
  }
};
