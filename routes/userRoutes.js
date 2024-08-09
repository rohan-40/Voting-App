const express = require('express');
const router = express.Router();
const User = require('./../models/user')


router.post('/signup',async (req,res) => {
    try{
        const data = req.body;
        const userData = new User(data);
    
        const response = await userData.save();
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json("Internal Server Error: ",err);
    }
})

router.post('/login',async (req,res) => {
    const {name,password} = req.body;
    const user = await User.findOne({name:name});
    if(!user && !(await user.comparePassword(password)))
    {
        res.status(403).json({message: "User or Password is Incorrect"})
    }

    res.status(200).json(user);

   

})

module.exports = router;