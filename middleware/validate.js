const validator = require('validator');

const validateRegister = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).send("Invalid Email");
  }
  next();
};

module.exports = validateRegister;