const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword, logout,
    confirmEmail,
} = require("../controllers/auth");
const router = express.Router();

// Protect/Auth middleware:
const { protect } = require("../middleware/auth");

// Passport:
const passport = require("passport");

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/confirmemail', confirmEmail);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Passport route for OAuth 2:
router.get('/githubLogin', passport.authenticate('github'));

// Paste this callback URL in GitHub Dev page:
// http://localhost:3000/api/v1/auth/github
router.get('/github', passport.authenticate('github', {
    successRedirect: '/api/v1/auth/account',
    failureRedirect: '/api/v1/auth/github'
}));

router.get('/account', (req, res) => {
    res.status(200).json({
        user: req.user
    });
})

module.exports = router;