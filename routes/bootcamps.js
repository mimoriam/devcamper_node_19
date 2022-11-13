const express = require('express');
const router = express.Router();
const {
    getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamps");

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Protect/Auth middleware:
const { protect } = require("../middleware/auth");

// Include course router for path: /api/v1/bootcamps/:bootcampId/courses
const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, bootcampPhotoUpload);

module.exports = router;