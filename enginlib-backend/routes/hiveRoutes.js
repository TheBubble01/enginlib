const express = require('express');
const router = express.Router();
const hiveController = require('../controllers/hiveController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a post in a HiveGroup
router.post(
  '/groups/:groupId/posts',
  authMiddleware,
  hiveController.createPost
);

// Pin a post
router.put(
  '/posts/:postId/pin',
  authMiddleware,
  hiveController.pinPost
);

// Pinned post notification preference toggle
router.put(
  '/groups/:groupId/preferences',
  authMiddleware,
  hiveController.setGroupNotificationPref
);

// Route to fetch posts and related data
router.get(
  '/groups/:groupId/posts',
  authMiddleware,
  hiveController.getGroupPosts
);

// DELETE a post
router.delete(
  '/posts/:postId',
  authMiddleware,
  hiveController.deletePost
);

// Fetch Forums according to department
router.get(
  '/forums/department/:departmentId',
  authMiddleware,
  hiveController.getForumByDepartment
);

// Create a HiveGroup under a forum
router.post(
  '/forums/:forumId/groups',
  authMiddleware,
  hiveController.createHiveGroup
);

// Reply to a post
router.post(
  '/posts/:postId/replies',
  authMiddleware,
  hiveController.createReply
);

// Fetch the replies
router.get(
  '/posts/:postId/replies',
  authMiddleware,
  hiveController.getRepliesForPost
);

// Post reaction route
router.post(
  '/react',
  authMiddleware,
  hiveController.reactToPostOrReply
);

// Fetching the ultimate postcard: Post, Replies, Reactions, ...Counts ...
router.get(
  '/posts/:postId/thread',
  authMiddleware,
  hiveController.getPostThread
);

module.exports = router;
