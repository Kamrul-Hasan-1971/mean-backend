const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      message: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
          error: err
        });
      });
  });
  
}

exports.userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  try {
    const fetchedUser = await User.findOne({ email: req.body.email });

    if (!fetchedUser) {
      return res.status(401).json({
        message: "No user found."
      });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, fetchedUser.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid authentication credentials!"
    });
  }
}

