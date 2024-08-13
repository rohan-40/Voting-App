const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Candidate = require("./../models/candidate");
const { jwtAuthMiddleWare, generateToken } = require("./../jwt");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
};


// For Creating  the Candidate by Admin
router.post("/signup", jwtAuthMiddleWare, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(401).json({ message: "You are not Admin" });
    }

    const data = req.body;
    const newCandidate = new Candidate(data);

    const response = await newCandidate.save();

    console.log("Data Saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(501).json({ error: "Internal Server Error" });
  }
});

// For Updating the Candidate Information by Admin
router.put("/:candidateID", jwtAuthMiddleWare, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(401).json({ message: "You are not Admin"});
    }

    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;
    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(401).json({ message: "Candidate not Found"});
    }

    console.log("Candidate Data Updated");
    res.status(200).json({ response: response });
  } 
  catch (err) {
    console.log(err);
    res.status(501).json({ error: "Internal Server Error" });
  }
});

// For Deleting the Candidate by Admin
router.delete("/:candidateID", jwtAuthMiddleWare, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(401).json({ message: "You are not Admin" });
    }

    const candidateID = req.params.candidateID;
    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(401).json({ message: "Candidate Not Found" });
    }

    console.log("Candidate Deleted");
    res.status(200).json(response);
  } 
  catch (err) {
    console.log(err);
    res.status(501).json({ error: "Internal Server Error" });
  }
});


// For Finding All Candidate
router.get('/', async(req,res) => {
    try{
        const response = await Candidate.find();
        res.status(200).json(response)
    }
    catch(err)
    {
        console.log(err);
        res.status(501).json({ error: "Internal Server Error" });   
    }
})

// For Voting By the Users
router.get('/vote/:candidateID',jwtAuthMiddleWare, async(req,res)=>{
    const candidateID = req.params.candidateID;
    const userId = req.user.id;
    try{
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Update the Candidate document to record the vote
        candidate.voteBy.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        console.log("Voted Succesfully");
        const response = await Candidate.findById(candidateID);
        console.log("Thanks For Voting");
        res.status(200).json(response);
    }
    catch(err)
    {
        console.log(err);
        res.status(501).json({ error: "Internal Server Error" });  
    }
})

// vote count 
router.get('/count', async (req, res) => {
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: -1});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Get List of all candidates with only name and party fields
router.get('/candidate', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
