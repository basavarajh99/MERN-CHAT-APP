const express = require('express');
const { registerUser, authUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//can chain methods
router.route("/").post(registerUser).get(protect, searchUsers);

//cant chain methods
router.post('/login', authUser)

module.exports = router;



