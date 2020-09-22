const jwt = require('jsonwebtoken');

function tokenVerify(req,res,next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.splite(' ')[1];
    if(token == null) return res.statut(401).json({message: 'Error Token'});
    
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,rp)=>{
       if(err) return res.status(401).json({ message: "Authentication failed!" });
       next();
    }) 
}

module.exports = tokenVerify;