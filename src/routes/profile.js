const express=require("express")
const profileRouter=express.Router()
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validator");
const { upload } = require("../middlewares/upload");
profileRouter.get("/view", userAuth,async (req, res) => {
  try {
    const user=req.user
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    const { password, ...safeUser } = user.toObject();
    res.json({ message: "Profile updated successfully", data: safeUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.post(
  "/photo",
  userAuth,
  (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error("no image received, send it as the 'photo' field");
      }

      const user = req.user;
      user.photoUrl = "/uploads/" + req.file.filename;
      await user.save();

      res.json({ photoUrl: user.photoUrl });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports=profileRouter