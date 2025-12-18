import express from "express";
import bcrypt from "bcrypt";
import customerModel from "../../models/coustomer/coustomer.js";
import sendmail from "../../utlis/mailer.js";
import sendSMS from "../../utlis/sms.js";
import  jwt from "jsonwebtoken";

const router = express.Router();
const port = process.env.PORT;
router.post("/register", async (req, res) => {
  try {
    let { fullName, email, password, phone, gender, age, address } = req.body;
    let user = await customerModel.findOne({ $or: [{ email }, { phone }] });
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
      fullName,
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
    await customerModel.insertOne(dbPayload);
    await sendmail(
      email,
      `Hello ${fullName}! Welcome to rapido in akola,`,
      `Your account is successfully registered with us please verify your email with given link ${eLink}`
    );
    // await sendSms(
    //   phone,
    //   `Welcome ${fullName}!\nPlease verify your mobile linked to swiggy account ${pLink}`
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
    await customerModel.updateOne(
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
    let pToken = req.params.phoneToken;
    let user = await customerModel.findOne({
      "verifyToken.phoneToken": pToken,
    });
    if (!user) return res.status(400).json({ msg: "Invalid user or link" });
    await customerModel.updateOne(
      { "verifyToken.phoneToken": pToken },
      { $set: { "isVerified.phone": true, "verifyToken.phoneToken": null } },
      { new: true }
    );
    res.status(200).json({ msg: "Your mobile number is now verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await customerModel.findOne({ email });
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

router.post("/forgot-password", async (req, res) => {
  try {
    let { email } = req.body;
    let user = await customerModel.findOne({ email });
    if (!user || user.isActive == false) {
      return res.status(400).json({ msg: "User not found, Access denied!" });
    }
    let tempPassword = Math.random().toString(36).slice(2, 10);
    console.log(tempPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

export default router;
