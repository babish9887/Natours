const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const multer=require('multer');
const sharp = require('sharp')
// const upload= multer({dest: 'public/img/users'}); 

// const multerStorage=multer.diskStorage({
//   destination: (req, res, cb)=>{
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb)=>{
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// })

const multerStorage=multer.memoryStorage();

const multerFilter=(req, file, cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  } else {
    cb(new AppError('Inappropriate format ',400), false);
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhoto=async (req, res, next)=>{
  if(!req.file) return next();
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/users/${req.file.filename}`);
  next();
}


exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! User SignUP instead!'
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(401).json({
      status: 'error',
      message: 'You cannot change the password!'
    });
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  if(req.file) filteredBody.photo=req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'Success',
    message: 'User data updated successfully! Please refresh to see Changes!😊',
    data: {
      user: updatedUser
    }
  });
};

exports.deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'Success',
    message: 'Account Deactivated Successfully'
  });
};
