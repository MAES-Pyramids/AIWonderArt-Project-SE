const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/users');
//------------handler functions ------------//
//-------------- Sign up
exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  //createAndSendToken
  const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // remove password from  newUser data output
  newUser.password = undefined;
  // Send cookie
  res.cookie('jwt', token, cookieOptions);
  // Send response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser
    }
  });
};
//-------------- Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email && !password) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Please provide email and password' });
    return;
  }
  if (!email) {
    res.status(400).json({ status: 'fail', message: 'Please provide email' });
    return;
  }
  if (!password) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Please provide password' });
    return;
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res
      .status(401)
      .json({ status: 'fail', message: 'Incorrect email or password' });
    return;
  }
  // 3) If everything ok, send token to client
  //createAndSendToken
  const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // remove password from  user data output
  user.password = undefined;
  // Send cookie
  res.cookie('jwt', token, cookieOptions);
  // Send response
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
//-------------- Logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 500),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
// ---------------protecting routes-----------------//
exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.'
    });

  // 2) Verification token
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token does no longer exist.'
    });
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
};
