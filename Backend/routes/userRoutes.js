const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');

const router = express.Router();

//can chain methods
router.route("/").post(registerUser)

//cant chain methods
router.post('/login', authUser)

module.exports = router;



