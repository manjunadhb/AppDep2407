const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const path = require("node:path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "./client/build")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.get("*", (req, res) => {
  res.sendFile("./client/build/index.html");
});

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  try {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: hashedPassword,
      mobileNo: req.body.mobileNo,
      profilePic: req.file.path,
    });

    await newUser.save();

    res.json({ status: "success", msg: "User created successfully." });
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to create user", error: err });
  }
});

app.put("/updateProfile", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  try {
    if (req.body.firstName.trim().length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { firstName: req.body.firstName }
      );
    }

    if (req.body.lastName.trim().length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { lastName: req.body.lastName }
      );
    }

    if (req.body.age > 0 && req.body.age < 100) {
      await User.updateMany({ email: req.body.email }, { age: req.body.age });
    }

    if (req.body.password.length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { password: req.body.password }
      );
    }

    if (req.body.mobileNo.length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { mobileNo: req.body.mobileNo }
      );
    }

    if (req.file && req.file.path) {
      await User.updateMany(
        { email: req.body.email },
        { profilePic: req.file.path }
      );
    }

    res.json({ status: "success", msg: "User details updated successfully." });
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to create user", error: err });
  }
});

app.delete("/deleteAccount", async (req, res) => {
  console.log(req.query);

  try {
    let result = await User.deleteMany({ email: req.query.email });
    console.log(result);

    if (result.deletedCount > 0) {
      res.json({ status: "success", msg: "User deleted successfully." });
    } else {
      res.json({ status: "failure", msg: "No User found." });
    }
  } catch (err) {
    res.json({
      status: "failure",
      msg: "Unable to delete account.",
      error: err,
    });
  }
});

app.post("/login", upload.none(), async (req, res) => {
  console.log(req.body);

  let result = await User.find().and([{ email: req.body.email }]);

  if (result.length > 0) {
    let isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      result[0].password
    );

    if (isPasswordCorrect == true) {
      let encryptedCredentials = jwt.sign(
        {
          email: req.body.email,
          password: req.body.password,
        },
        "khuljasimsim"
      );

      let dataToSend = {
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        age: result[0].age,
        email: result[0].email,
        mobileNo: result[0].mobileNo,
        profilePic: result[0].profilePic,
        token: encryptedCredentials,
      };

      res.json({ status: "success", data: dataToSend });
    } else {
      res.json({ status: "failure", msg: "Invalid Password." });
    }
  } else {
    res.json({ status: "failure", msg: "Invalid Email." });
  }
});

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log(req.body);

  let decryptedCredentials = jwt.verify(req.body.token, "khuljasimsim");

  console.log(decryptedCredentials);

  let result = await User.find().and([{ email: decryptedCredentials.email }]);

  if (result.length > 0) {
    if (result[0].password == decryptedCredentials.password) {
      let dataToSend = {
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        age: result[0].age,
        email: result[0].email,
        mobileNo: result[0].mobileNo,
        profilePic: result[0].profilePic,
      };

      res.json({ status: "success", data: dataToSend });
    } else {
      res.json({ status: "failure", msg: "Invalid Password." });
    }
  } else {
    res.json({ status: "failure", msg: "Invalid Email." });
  }
});

app.listen(4567, () => {
  console.log("Listening to port 4567");
});

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let User = new mongoose.model("users", userSchema, "users");

let connectToMDB = async () => {
  try {
    mongoose.connect(process.env.mdbURL);
    console.log("Successfully connected to MDB");
  } catch (err) {
    console.log("Unable to connect to MDB");
  }
};

connectToMDB();
