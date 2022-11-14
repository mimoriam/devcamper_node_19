const express = require('express');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const { getReviews, getReview, addReview, deleteReview, updateReview } = require("../controllers/reviews");

router.route('/').get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews
)
    .post(protect, authorize('user', 'admin'), addReview);

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;