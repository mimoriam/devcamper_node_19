const express = require('express');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const { getReviews, getReview } = require("../controllers/reviews");

router.route('/').get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews
);

router
    .route('/:id')
    .get(getReview);

module.exports = router;