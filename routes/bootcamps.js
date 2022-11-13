const express = require('express');
const router = express.Router();
const {
    getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamps");

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Include course router for path: /api/v1/bootcamps/:bootcampId/courses
const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(createBootcamp);

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;