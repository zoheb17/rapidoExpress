import express from "express";
import dotenv from "dotenv";
dotenv.config();

import "./utlis/dbconnect.js";
import userRouter from "./controllers/public/user.js";
import router from "./controllers/private/user.js";
import authmiddleware from "./auth/auth.js";
import riderRouter from "./controllers/public/rider.js";
import privateRouter from "./controllers/private/rider.js";
const app = express();
app.use(express.json());
const port = process.env.PORT;

app.get("/", (req, res) => {
  try {
    res.status(200).json({ msg: "hiii" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
app.use("/public/user", userRouter);
app.use("/public/rider", riderRouter);
app.use(authmiddleware);
app.use("/private", router);
app.use("/private/rider", privateRouter);

app.listen(port, () => {
  console.log(`server start at http://localhost:${port}`);
});
