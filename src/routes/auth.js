const express = require("express");
const authRouter = express.Router();
const { validateSignup } = require("../utils/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    const checkKeys = [
      "firstName",
      "lastName",
      "email",
      "age",
      "gender",
      "password",
    ];

     validateSignup(req);
     console.log("scqaxccx")

    const keys = Object.keys(req.body).every((k) => checkKeys.includes(k));
    if (!keys) {
      throw new Error("invalid data added");
    }

    const { firstName, lastName, email, age, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email already exists");
    }

    const encPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: encPassword,
    });

    await user.save();
    res.send("user added");
  } catch (error) {
    // duplicate key from the unique index (two signups racing past the check above)
    if (error.code === 11000) {
      return res.status(409).send("Email already exists");
    }
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await User.find({ email: email });

    if (!user) {
      return res.status(400).send("Invalid Credentials");
    }

    const authentication = await bcrypt.compare(password, user.password);

    if (!authentication) {
      return res.status(400).send("Invalid Credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token);
      return res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(0), // Set to a past date to immediately expire the cookie
    })
   res.send("logout successfully")
  } catch (error) {}
});

module.exports = authRouter;
