import express  from "express";
// import bcrypt from "bcrypt"
import riderModel from "../../models/Riders/Riders.js"  
import rideModel from "../../models/Rides/rides.js";

const router = express.Router(); 

router.get("/rider-details", async (req, res) => {
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
router.put("/rider-update", async (req, res) => {
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
})

router.get("/rider-onduty",async(req,res)=>{
    try {
        let rider = req.user;
        console.log(rider)
        await riderModel.updateOne({_id : rider.id},{$set:{isOnline:true}})
        res.status(200).json({msg : "you are now on-duty"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})

router.get("/rider-ofduty",async(req,res)=>{
    try {
        let rider = req.user;
        console.log(rider);
        console.log(".");
        await riderModel.updateOne({_id : rider.id},{$set:{isOnline:false}})
        res.status(200).json({msg : "you are now off-duty"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})


router.get("/rider-history",async (req,res)=>{
    try {

      let rider =req.user
        console.log(rider);
  
        let history = await rideModel.find({riderId : rider.id},{"rideDetails.from" : 1, "rideDetails.to" : 1 , "rideDetails.fare" : 1 ,_id:0 })
      
        res.status(200).json(history)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
export default router



