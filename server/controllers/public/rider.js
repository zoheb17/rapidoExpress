import express from "express";
import sendmail from "../../utlis/mailer.js";
import sendSMS from "../../utlis/sms.js";
import riderModel from"../../models/Riders/Riders.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const port = process.env.PORT

const router=express.Router()





router.post("/register", async (req, res) => {
  try {
    console.log("zoheb");
    let { riderName, email, password, phone, gender, age, address } = req.body;
    let user = await riderModel.findOne({ $or: [{ email }, { phone }] });
    if (user)
      return res  
        .status(400)
        .json({ msg: "Account already exist with this info" });
    password = await bcrypt.hash(password, 10);
    const eToken = Math.random().toString(36).slice(2, 10);
    const pToken = Math.random().toString(36).slice(2, 10);
    const eLink = `http://localhost:${port}/user/verify-email/${eToken}`;
    // const pLink = `http://localhost:${port}/user/verify-phone/${pToken}`;
    const dbPayload = {
      riderName,
      email,
      password,
      phone,
      gender,
      age,
      address,
      verifyToken: {
        emailToken: eToken,
        phoneToken: pToken,
      },
    };
    await riderModel.insertOne(dbPayload);
    await sendmail(
      email,
      `Hello ${riderName}! Welcome to rapido travel anywher Akola,`,
      `Your account is successfully registered with us please verify your email with given link ${eLink}`
    );
    // await sendSms(
    //   phone,
    //   `Welcome ${riderName}!\nPlease verify your mobile linked to swiggy account ${pLink}`
    // );
    res.status(201).json({
      msg: "Account created successfully, verify your email and phone to continue",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verify-email/:emailToken", async (req, res) => {
  try {
    let eToken = req.params.emailToken;
    if (!eToken) return res.status(400).json({ msg: "Invalid Token" });
    await riderModel.updateOne(
      { "verifyToken.emailToken": eToken },
      { $set: { "isVerified.email": true, "verifyToken.emailToken": null } },
      { new: true }
    );
    res.status(200).json({ msg: "Email address is now verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verify-phone/:phoneToken", async (req, res) => {
  try {
    let eToken = req.params.phoneToken;
    if (!eToken) return res.status(400).json({ msg: "Invalid Token" });
    await riderModel.updateOne(
      { "verifyToken.phoneToken": eToken },
      { $set: { "isVerified.phone": true, "verifyToken.phoneToken": null } },
      { new: true }
    );
    res.status(200).json({ msg: "phone address is now verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await riderModel.findOne({ email });
    if (!user || user.isActive == false)
      return res.status(400).json({ msg: "User not found, Access denied" });

    if (!user.isVerified.email && !user.isVerified.phone)
      return res
        .status(400)
        .json({ msg: "Account is not verified. Verify it first" });

    let pass = await bcrypt.compare(password, user.password);
    if (!pass) return res.status(400).json({ msg: "Invalid Credentials" });

    let payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.SECKEY, { expiresIn: "1d" });
    res.status(200).json({ msg: "Login successfull", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});


export default router 
  
