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
      return res.status(401).json({ message: "Candidate Not Found" });
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




module.exports = router;
