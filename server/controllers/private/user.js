import express  from "express";
import bcrypt from "bcrypt"
import customerModel from "../../models/coustomer/coustomer.js"
import riderModel from "../../models/Riders/Riders.js";
import rideModel from "../../models/Rides/rides.js";



const router = express.Router();
router.get("/user-details", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let details = await customerModel.findOne(
      { id: user._id },
      { fullName: 1, age: 1, _id: 0 }
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

    await customerModel.updateOne({ id: user._id }, { $set: userinput });
    res.status(200).json({ msg: "user update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});


// router.delete("/user-delete",async(req,res)=>{
//   try {
//     let user=req.user;
//     await customerModel.updateOne(
//       {id: user._id},
//       {$set:{isActive:false}},
//       {new:true}

//     );
//     res.status(200).json({msg:"user delete sucessfully "});

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({msg:})
//   }
// })



router.post("/book-ride",async(req,res)=>{
  try {
     let{from,to,amount,paymentMethod,distance}=req.body 
     let user=await customerModel.findOne({_id:req.user.id})
     let rider = await riderModel.findOne({isOnline:true}) 
     console.log(rider)
     let fare =distance *10
     let ridepayload={
      customerId:user._id,
      riderId:rider._id,
      rideDetails:{
        from,
        to,
        amount,
        paymentMethod,
        fare
      }
     }
     await rideModel.insertOne(ridepayload)
     res.status(200).json({msg:"rider assigned "})

  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})
    
    
  }
})


router.get("/history",async(req,res)=>{
  try {
    console.log(req.user)
  let user=await customerModel.findOne({_id:req.user.id}) 
  console.log(user)
  let history= await rideModel.findOne({customerId:user._id}, {"rideDetails.from" : 1, "rideDetails.to" : 1 , "rideDetails.fare" : 1 ,_id : 0})
  console.log(history);


  
  res.status(200).json(history)
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})
  }
})


export default router;