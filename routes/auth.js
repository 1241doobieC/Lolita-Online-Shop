const express = require('express');

const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin );
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/auth/google', authController.googleLogin);
router.get('/auth/google/callback', authController.googleCallback);

module.exports = router;