import express  from "express";
// import bcrypt from "bcrypt"
import riderModel from "../../models/Riders/Riders.js"  

const router = express.Router(); 

router.get("/user-details", async (req, res) => {
  try{
    let user = req.user;
    console.log(user);
    let details = await riderModel.findOne(
      { _id: req.user.id },
      {  riderName: 1, age: 1, _id: 0 }
    );

    res.status(200).json({ msg: details });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.put("/user-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userinput = req.body;

    await riderModel.updateOne({ id: user._id }, { $set: userinput });
    res.status(200).json({ msg: "user update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
export default router



