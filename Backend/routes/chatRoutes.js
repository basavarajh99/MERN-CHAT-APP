const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//only logged in users can access chat
router.route("/").post(protect, accessChat);

//all the chats belonging to particular user
router.route("/").get(protect, fetchChats);

//creation of group
router.route("/group").post(protect, createGroupChat);

//renaming the group will be a put request
router.route("/rename").put(protect, renameGroup);

//to remove a memeber from group or leave the group
router.route("/removefromgroup").put(protect, removeFromGroup);

//to add someone to group
router.route("/addtogroup").put(protect, addToGroup);

module.exports = router;