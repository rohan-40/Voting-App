const jwt = require('jsonwebtoken');

const jwtAuthMiddleWare = (req,res,next) =>{
    const authorization = req.headers.authorization;
    if(!authorization){
        return res.status(404).json({message: "Token not found"});
    }

    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({error: "Invalid Token"});
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn: 30000});
}

module.exports = {jwtAuthMiddleWare,generateToken};