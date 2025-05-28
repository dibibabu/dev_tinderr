const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedObj = await jwt.verify(token, "shhhhh");

    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("No User Found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
module.exports = { userAuth };
