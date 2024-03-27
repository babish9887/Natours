const express = require('express');
const viewsController=require('../controllers/viewsController')
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')

const router = express.Router();

router.get('/signup', viewsController.getSignupForm)

router.get('/forgotpassword', viewsController.getForgotPasswordForm)

router.get('/resetPassword/:token', viewsController.getResetPasswordForm)


router.get('/',bookingController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug',authController.isLoggedIn,authController.getUser, viewsController.getTour)

router.get('/login',authController.isLoggedIn, viewsController.getLoginForm);

router.get('/me',authController.protect, viewsController.getAccount);

router.get('/my-bookings',authController.protect,  viewsController.getMyTours);

router.get('/my-bookings/:slug',authController.protect,  viewsController.getBookedTour);

router.get('/my-reviews',authController.protect,  viewsController.getMyReviews);
router.get('/my-reviews/:slug',authController.protect,  viewsController.getReviewedTour);

//admin routes
router.get('/manage-tours',authController.protect,  viewsController.getManageTours);

router.get('/manage-users',authController.protect,  viewsController.getManageUsers);




router.post('/submit-user-data',authController.protect, viewsController.updateUserData);

module.exports = router;

