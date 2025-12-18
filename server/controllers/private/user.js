import express  from "express";
import bcrypt from "bcrypt"
import customerModel from "../../models/coustomer/coustomer.js"


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

export default router;