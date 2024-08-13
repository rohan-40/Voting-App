const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleWare,generateToken} = require('./../jwt');


// For Creating the User
router.post('/signup',async (req,res) => {
    try{
        const data = req.body;
        const userData = new User(data);
    
        const response = await userData.save();

        const payload = {
            id: userData.id,
        }

        const token = generateToken(payload);

        res.status(200).json({response,token});
    }
    catch(err){
        console.log(err);
        res.status(500).json("Internal Server Error: ",err);
    }
})


// For login and Generate new Token by User
router.post('/login',async (req,res) => {
    try{
        const {name,password} = req.body;
        const user = await User.findOne({name:name});

        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }


        if(!user || !(await user.comparePassword(password)))
        {
            return res.status(403).json({message: "User or Password is Incorrect"})
        }
    
        const payload = {
            id: user.id
        }
    
        const token = generateToken(payload);
    
        res.status(200).json({user,token}) 
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({error: "Internal Server error"});

    }

})


// For check Profile By User
router.get('/profile',jwtAuthMiddleWare, async(req,res) =>{
    try{
        const userData = req.user;
        console.log("UserData: ",userData)

        const userId = userData.id;
    
        const user = await User.findById(userId);

        res.status(200).json({user})

    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({error: "Internal Server error"});
    }
})


// For Updating the User Password By User
router.put('/profile/password', jwtAuthMiddleWare, async(req,res) =>{
    try{
        const userId = req.user.id;
        const {currentPassword, newPassword} = req.body;

        if(!currentPassword || !newPassword)
        {
            return res.status(400).json({error: "Both Password Required"});
        }

        const user = await User.findById(userId);
        if(!user || !(await user.comparePassword(currentPassword)))
        {
            return res.status(400).json({message: "Incorrect Password"});
        }

        user.password = newPassword;
        await user.save()
    
        console.log("Password updated");
        res.status(200).json(user);
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({error: "Internal Server error"});   
    }
})

module.exports = router;