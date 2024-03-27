const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const express=require('express')
const router=express.Router();

router.route('/')
.get(authController.protect,authController.restrictTo('admin'),reviewController.getAllReviews)
.post(
    authController.protect, 
    reviewController.setTourUserIds,
    // authController.restrictTo, 
    reviewController.createReview);


router.route('/:id')
.get(reviewController.getReview)
.delete(reviewController.deleteReview)
.patch(reviewController.updateReview)

module.exports=router;