const util = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const secret = 'babishisagoodboy';
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const mongoSanitize = require('mongo-sanitize');
const Email = require('./../utils/email')
const signToken = id => {
  return jwt.sign({ id: id }, secret, {
    expiresIn: '3d'
  });
};

const  createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    // secure: false,
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  console.log(user);
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user: user
    }
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role
    });
    const url = `${req.protocol}://${req.get('host')}/me`;
    // await new Email(newUser, url).sendWelcome()
    await sendEmail({
      firstName: newUser.name,
      url,
      subject: "Welcome to Natours Family",
      email: newUser.email,
      template:'welcome'
     })

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail from signp',
      message: err.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email: unsanitized, password } = req.body;
    const email = mongoSanitize(unsanitized);
    if (!email || !password) {
      return res.status(404).json({
        status: 'not Found',
        message: 'Email or password field is empty'
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(404).json({ message: 'Incorrect email or password' });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.logout = (req, res)=> {
  res.cookie('jwt', '', { // setting cookie value to empty string
    expires: new Date(0), // setting expiration date to past date
    httpOnly: true
  });
  res.status(200).json({
    status: 'Success'
  });
}


const verifyAsync = util.promisify(jwt.verify);
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt){
      token = req.cookies.jwt;
    }
    
    if (!token) {
      const currentUrl =  req.originalUrl;
      if(currentUrl === '/me')
        return res.status(401).redirect('/login')
      return res.status(401).json({ message: 'You are not logged in!' });
    }

    //   Verify token
    const decoded = await verifyAsync(token, secret);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser)
      return res
        .status(401)
        .json({ status: 'Fail', message: 'User not Found' });

    if (freshUser.changedPasswordAfter(decoded.iat))
      return res
        .status(401)
        .json({ status: 'Fail', message: 'User recently changed Password' });

    // res.json({
    //   token,
    //   status: 'nothing'
    // });
    req.user = freshUser;
    res.locals.user=freshUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
};



exports.getUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt){
      token = req.cookies.jwt;
    }
    
    if (!token) {
     return next();
    }

    //   Verify token
    const decoded = await verifyAsync(token, secret);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser)
      return next()

    if (freshUser.changedPasswordAfter(decoded.iat))
      return next()

    // res.json({
    //   token,
    //   status: 'nothing'
    // });
    req.user = freshUser;
    res.locals.user=freshUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
};











//only for render pages, no errir
exports.isLoggedIn = async (req, res, next) => {
  try {
    if(req.cookies.jwt){
      //   Verify token
      const decoded = await verifyAsync(req.cookies.jwt, secret);
      
    const freshUser = await User.findById(decoded.id);
    if (!freshUser)
      return next()

    if (freshUser.changedPasswordAfter(decoded.iat))
      return next();

    res.locals.user= freshUser;
    next();
  }
  next();
  } catch (err) {
    return (next);
  }
};


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ status: 'Fail', message: 'You dont have permission' });
    }
    next();
  };
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({
      status: 'Fail',
      message: 'User not found with that email address'
    });

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;

  // const message = `Forgot you password? submit a patch requirest with you new password to ${resetURL}`;

  try {

    await sendEmail({
      firstName: user.name,
      url:resetURL,
      subject: "Reset Your password",
      email: user.email,
      template:'passwordReset',
      // text: message
     })


    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email',
      resetToken
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
};

// exports.resetPassword = (req, res, next) => {
//   res.send('nothing');
// };

exports.resetPassword = async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gte: Date.now() }
  });

  // if token is not expired, set the new password
  if (!user) {
    res.status(400).json({
      status: 'Fail',
      message: 'User not found or Token is expired'
    });
  }
  try {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;

    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }

};

exports.updatePassword = async (req, res) => {
  // Get user from collection
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      res.status(400).json({
        status: 'Fail',
        message: 'Your current password in wrong!!'
      });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // check if posted current password is correct
    createSendToken(user, 200, res);

    // If so, update password

    // Log user id, sent JWT
  } catch (e) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
};
