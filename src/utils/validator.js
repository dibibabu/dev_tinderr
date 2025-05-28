const validator = require("validator");

const validateSignup = (req) => {
  const data = req.body;
  console.log(data.firstName);

  if (!data.firstName || !data.lastName) {
    throw new Error("Name is not valid");
  }

  if (!validator.isStrongPassword(data.password)) {
    throw new Error("password is not strong " + data.password);
  }
};


const validateEditProfileData=(req)=>{

  const allowedFields=["firstName","lastName","email","age","gender"

  ]

  const isValid=Object.keys(req.body).every(field=>allowedFields.includes(field))

return isValid
}
module.exports = validateSignup,validateEditProfileData;
