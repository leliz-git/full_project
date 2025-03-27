const jwt = require('jsonwebtoken')

const brokerJWT =(req,res,next)=>{
   
    if(req.user.roles==="Broker")
        {
            return next()
        }
    return res.status(401).json({ message: 'Unauthorized2' })

}

module.exports = brokerJWT