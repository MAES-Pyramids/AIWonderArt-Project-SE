const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/users');
const AppError = require('./../utils/appError');
const catchAsyncError = require('./../utils/catchAsyncError');
//-----------------JWT-----------------------//
function signToken(id) {
  return JWT.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}
function createAndSendToken(user, statusCode, req, res) {
  const token = signToken(user._id);
  // remove password from  user data output
  user.password = undefined;
  // Send cookie
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  // Send response
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}
//------------handler functions ------------//
//-------------- Sign up
exports.signup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  createAndSendToken(newUser, 201, req, res);
});
//-------------- Login
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email && !password)
    return next(new AppError('Please provide email and password', 400));
  if (!email) return next(new AppError('Please provide email', 400));
  if (!password) return next(new AppError('Please provide password', 400));

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createAndSendToken(user, 200, req, res);
});
//-------------- Logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 500),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
// ---------------protecting routes-----------------//
exports.protect = catchAsyncError(async (req, res, next) => {
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
    return next(
      new AppError('You are not login! Please login to get access.', 401)
    );

  // 2) Verification token
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.isPasswordChanged(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // Grant access to protected route by adding user to req object
  next();
});
