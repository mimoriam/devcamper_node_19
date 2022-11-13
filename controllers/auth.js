const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Register user
// @route     GET /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    // Create User:
    const user = await User.create({
        name, email, password, role
    });

    // Create token by using function from User Model:
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    });
});