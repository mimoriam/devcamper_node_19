const express = require('express');
const router = express.Router();
const {
    getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamps");

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Protect/Auth middleware:
const { protect, authorize } = require("../middleware/auth");

// Include course router for path: /api/v1/bootcamps/:bootcampId/courses
const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);

// Include review router for path: /api/v1/bootcamps/:bootcampId/reviews
const reviewRouter = require('./reviews');
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;