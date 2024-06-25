const jwt = require("jsonwebtoken");

const generateJWTToken = async(payload)=>{
    const secret = process.env.JWT_SECRET_KEY;
    if(!secret) throw new Error("jwt secret key not defined");

    try{

        if(!payload) throw new Error("payload not provided in token genration")

        const options ={
            issuer:process.env.JWT_ISSUER,
            audience:process.env.JWT_AUDIENCE,
            algorithm:process.env.JWT_ALGORITHM,
            expiresIn:process.env.JWT_EXPIRES_IN
        }
    
        const token = await jwt.sign(payload,secret,options);
        return token;
    }catch(error){
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
}

module.exports = generateJWTToken