const express = require("express");
const Group = require("../models/GroupModel");
const {protect, isAdmin} = require("../middleware/authMiddleware");
const GroupRouter = express.Router();

//Cerate new
GroupRouter.post("/", protect, isAdmin, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);
    const { name, description, members, admin } = req.body;

    const group = await Group.create({
      name,
      description, 
      admin: req.user._id,
      members: [req.user._id],
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("admin", "username email")
      .populate("members", "username email");
    res.status(201).json({ populatedGroup });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Internal server error" });
  }
});

//Get all Group
GroupRouter.get("/", protect, async (req, res) => {
  try {
    const groups = await Group.find().populate("admin", "username email").populate("members", "username email");
    res.status(200).json(groups);
    } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Internal server error" });
  }
});

//Find one Group
GroupRouter.get("/:groupId", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("admin", "username email").populate("members", "username email");
    res.status(200).json(group);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Internal server error" });
  }
});

// Joining Group
GroupRouter.post("/:groupId/join", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    //! Checking the User is already in the Group or Not
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already joined" });
    }
    //Joining the Group
    group.members.push(req.user._id);
    await group.save();
    res.status(200).json({ message: "Joined successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//Leaving Group
GroupRouter.post("/:groupId/leave", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if(!group){
      return res.status(404).json({message: "Group not found"});
    }
    if(!group.members.includes(req.user._id)){
      return res.status(400).json({message: "You are not in the group"});
    }
    group.members = group.members.filter((member) => member.toString() !== req.user._id.toString());
    await group.save();
    res.status(200).json({message: "Left successfully"});
  } catch (err) {
    res.status(500).json({message: "Internal server error"});
  }
});
    
//Deleting Group
GroupRouter.delete("/:groupId", protect, isAdmin, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if(!group) {
        return res.status(404).json({message: "Group not found"});
    }
    await group.remove();
    res.status(200).json({message: "Group deleted successfully"});
    }
    catch (err) {
    console.log(err);
    res.status(500).json({message: "Internal server error"});
  }
});




module.exports = GroupRouter;
