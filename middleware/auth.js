const jwt = require('jsonwebtoken')
const User = require('../models/user')

//middleware to authenticate the incoming request
const Authenticate = (req, res, next)  => {
    try {
        const token = req.header('Authorization')
        console.log(token);
        const user = jwt.verify(token, '932ufhapy9y39hohaldh983yr839hrfoaoh3q0yrhgin4huhtpaibp2q01phpqhqu0uhpdnnqp9y43875y4gbfpiuhfadnv')
        console.log('userID=', user.userId)
        User.findById(user.userId).then(user=>{

            req.user = user // set req.user to user
            next();
        }).catch(err=>console.log(err))
    } catch(err){
        console.log(err)
        return res.status(401).json({success: false})
    }
}

module.exports = {
    Authenticate
}