const { 
  HivePost,
  HiveReply,
  HiveReaction,
  HiveGroup,
  User,
  HiveForum,
  Department,
  GroupNotificationPreference,  
  Notification
} = require('../models');

const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const { notifyMentions } = require('../utils/tagHelpers');

// Create a post
exports.createPost = async (req, res) => {
  const { groupId } = req.params;
  const { content, mediaUrl, tags, lifespan } = req.body;
  const userId = req.user.id;

  try {
    const group = await HiveGroup.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ msg: 'Hive group not found' });
    }

    const post = await HivePost.create({
      groupId,
      userId,
      content,
      mediaUrl: mediaUrl || null,
      tags: tags || [],
      lifespan: req.user.role === 'tech-admin' && lifespan // tech-admin can override it
        ? lifespan
	: 129600 // 3 months in minutes: default value for users
    });

    // Emit Real-Time Event to everyone in the group
    const io = req.app.get('io');
    console.log(`Emitting newPost to room: group_${group.id}`);
    io.to(`group_${group.id}`).emit('newPost', {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });

    // Notify a tagged user
    await notifyMentions({
      content,
      sourceUserId: req.user.id,
      postId: post.id
    });

    res.status(201).json({
      msg: 'Post created in The Hive',
      postId: post.id
    });
  } catch (err) {
    console.error('Error creating HivePost:', err.message);
    res.status(500).json({ msg: 'Server error while posting to Hive' });
  }
};

// Pin a post (admin)
exports.pinPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await HivePost.findByPk(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const group = await HiveGroup.findByPk(post.groupId);
    if (!group) return res.status(404).json({ msg: 'Group not found' });

    // Only allow admins
    if (!['tech-admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Only admins can pin/unpin posts' });
    }

    const newStatus = !post.isPinned;
    post.isPinned = newStatus;
    await post.save();

    if (newStatus) {
      // ✅ Notify users who opted in
      const optIns = await GroupNotificationPreference.findAll({
        where: { groupId: group.id, pinNotifications: true }
      });

      const creator = await User.findByPk(req.user.id);
      const expiresAt = new Date(post.createdAt.getTime() + post.lifespan * 60 * 1000);

      for (let pref of optIns) {
        if (pref.userId === req.user.id) continue; // don't notify the admin who pinned

        await Notification.create({
          userId: pref.userId,
          postId: post.id,
          message: `@${creator.username} pinned a post in ${group.title}.`,
          isRead: false,
          expiresAt
        });
      }
    } else {
      // ❌ Remove old pin notifications for this post
      await Notification.destroy({
        where: {
          postId: post.id,
          message: {
            [Op.iLike]: '%pinned a post%' // match both old and new formats
          }
        }
      });
    }

    res.status(200).json({
      msg: newStatus ? 'Post pinned and users notified' : 'Post unpinned',
      isPinned: newStatus
    });

  } catch (err) {
    console.error('Error pinning/unpinning post:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Preference for Pinned post notification
exports.setGroupNotificationPref = async (req, res) => {
  const { groupId } = req.params;
  const { pinNotifications } = req.body;
  const userId = req.user.id;

  try {
    const [pref, created] = await GroupNotificationPreference.findOrCreate({
      where: { userId, groupId },
      defaults: { pinNotifications }
    });

    if (!created) {
      pref.pinNotifications = pinNotifications;
      await pref.save();
    }

    res.status(200).json({
      msg: 'Preference updated',
      preference: pref
    });
  } catch (err) {
    console.error('Error setting group preference:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// fetch all posts and related data
exports.getGroupPosts = async (req, res) => {
  const groupId = req.params.groupId;
  const { page = 1, limit = 10, sort = 'newest' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const posts = await HivePost.findAll({
      where: { groupId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profileDetails']
        },
        {
          model: HiveReply,
          attributes: ['id']
        },
        {
          model: HiveReaction,
          attributes: ['type']
        }
      ],
      order: [
        sort === 'oldest' ? ['createdAt', 'ASC'] :
        sort === 'popular' ? [Sequelize.literal('(SELECT COUNT(*) FROM "HiveReactions" WHERE "HiveReactions"."postId" = "HivePost"."id")'), 'DESC'] :
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formatted = posts.map((post) => {
      const upVotes = post.HiveReaction?.filter(r => r.type === 'up').length || 0;
      const downVotes = post.HiveReaction?.filter(r => r.type === 'down').length || 0;

      return {
        id: post.id,
        user: post.User,
        content: post.content,
        mediaUrl: post.mediaUrl,
        createdAt: post.createdAt,
        replyCount: post.HiveReplies?.length || 0,
        upVotes,
        downVotes
      };
    });

    res.status(200).json({
      page: parseInt(page),
      total: formatted.length,
      posts: formatted
    });

  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).json({ msg: 'Server error fetching posts' });
  }
};

// Delete post with all related data
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const isTechAdmin = req.user.role === 'tech-admin';

  try {
    const post = await HivePost.findByPk(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Only allow if user created it or is tech-admin
    if (post.userId !== userId && !isTechAdmin) {
      return res.status(403).json({ msg: 'Unauthorized to delete this post' });
    }

    // Get all replies under this post
    const replies = await HiveReply.findAll({ where: { postId } });
    const replyIds = replies.map(r => r.id);

    // Delete notifications related to post and replies
    const { Notification } = require('../models');

    await Notification.destroy({ where: { postId } });
    if (replyIds.length) {
      await Notification.destroy({ where: { replyId: replyIds } });
    }

    // Delete replies
    await HiveReply.destroy({ where: { postId } });

    // Delete post itself
    await HivePost.destroy({ where: { id: postId } });

    // (Optional) Broadcast post deletion
    const group = await HiveGroup.findByPk(post.groupId);
    if (group) {
      const io = req.app.get('io');
      io.to(`group_${group.id}`).emit('postDeleted', { postId: post.id });
    }

    res.status(200).json({ msg: 'Post and related data deleted successfully' });

  } catch (err) {
    console.error('Error deleting HivePost:', err.message);
    res.status(500).json({ msg: 'Server error while deleting post' });
  }
};

// Fetch Forums by department
exports.getForumByDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const forum = await HiveForum.findOne({
      where: { departmentId },
      include: {
        model: Department,
        attributes: ['name', 'logo', 'description']
      }
    });

    if (!forum) {
      return res.status(404).json({ msg: 'HiveForum not found for this department' });
    }

    res.status(200).json({
      id: forum.id,
      department: forum.Department.name,
      logo: forum.Department.logo,
      description: forum.Department.description
    });
  } catch (err) {
    console.error('Error fetching HiveForum:', err.message);
    res.status(500).json({ msg: 'Server error while retrieving forum' });
  }
};

// Create a group under a Hive forum
exports.createHiveGroup = async (req, res) => {
  const { forumId } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const forum = await HiveForum.findByPk(forumId);
    if (!forum) {
      return res.status(404).json({ msg: 'HiveForum not found' });
    }

    const group = await HiveGroup.create({
      forumId,
      title,
      description,
      createdBy: userId
    });

    res.status(201).json({
      msg: 'HiveGroup created successfully',
      groupId: group.id
    });
  } catch (err) {
    console.error('Error creating HiveGroup:', err.message);
    res.status(500).json({ msg: 'Server error while creating group' });
  }
};

// Reply to a post
exports.createReply = async (req, res) => {
  const { postId } = req.params;
  const { content, parentReplyId, mediaUrl, tags } = req.body;
  const userId = req.user.id;

  try {
    const post = await HivePost.findByPk(postId);

    if (!post) {
      return res.status(404).json({ msg: 'HivePost not found' });
    }

    // Optional: validate parentReplyId belongs to the same post
    if (parentReplyId) {
      const parentReply = await HiveReply.findByPk(parentReplyId);
      if (!parentReply || parentReply.postId !== post.id) {
        return res.status(400).json({ msg: 'Invalid parent reply' });
      }
    }

    const reply = await HiveReply.create({
      postId,
      userId,
      parentReplyId: parentReplyId || null,
      content,
      mediaUrl: mediaUrl || null,
      tags: tags || []
    });
    
    // Emit reply to same group room
    const group = await HiveGroup.findByPk(post.groupId);
    const io = req.app.get('io');
    console.log(`Emitting newReply to room: group_${group.id}`);

    io.to(`group_${group.id}`).emit('newReply', {
      replyId: reply.id,
      postId,
      content: reply.content,
      parentReplyId: parentReplyId || null,
      createdAt: reply.createdAt,
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });

    // Notify a tagged user
    await notifyMentions({
      content,
      sourceUserId: req.user.id,
      postId: postId,
      replyId: reply.id
    });

    res.status(201).json({
      msg: 'Reply posted successfully',
      replyId: reply.id
    });
  } catch (err) {
    console.error('Error creating reply:', err.message);
    res.status(500).json({ msg: 'Server error while posting reply' });
  }
};

// Fetch the replies
exports.getRepliesForPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const replies = await HiveReply.findAll({
      where: { postId },
      include: {
        model: User,
        attributes: ['id', 'username', 'profileDetails']
      },
      order: [['createdAt', 'ASC']]
    });

    // Group replies by parentReplyId
    const grouped = {};
    replies.forEach(reply => {
      const parentId = reply.parentReplyId || 'root';
      if (!grouped[parentId]) grouped[parentId] = [];
      grouped[parentId].push(reply);
    });

    // Recursive structure builder
    const buildThread = (parentId = 'root') => {
      return (grouped[parentId] || []).map(reply => ({
        id: reply.id,
        user: reply.User,
        content: reply.content,
        createdAt: reply.createdAt,
        mediaUrl: reply.mediaUrl,
        tags: reply.tags,
        replies: buildThread(reply.id)
      }));
    };

    res.status(200).json({
      postId,
      replies: buildThread()
    });

  } catch (err) {
    console.error('Error fetching replies:', err.message);
    res.status(500).json({ msg: 'Server error while fetching replies' });
  }
};

// Post reactions
exports.reactToPostOrReply = async (req, res) => {
  const { postId, replyId, type } = req.body;
  const userId = req.user.id;

  if (!['up', 'down'].includes(type)) {
    return res.status(400).json({ msg: 'Invalid reaction type' });
  }

  if (!postId && !replyId) {
    return res.status(400).json({ msg: 'Must react to either postId or replyId' });
  }

  try {
    const where = { userId, type, postId: postId || null, replyId: replyId || null };

    const [reaction, created] = await HiveReaction.findOrCreate({
      where: { userId, postId: postId || null, replyId: replyId || null },
      defaults: { type }
    });

    if (!created) {
      reaction.type = type;
      await reaction.save();
    }

    // Emmit post reactions to group memebers
    
    if (postId) {
      const post = await HivePost.findByPk(postId);
      if (!post) return res.status(404).json({ msg: 'Post not found' });

      group = await HiveGroup.findByPk(post.groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });
    }
    if (replyId) {
      const reply = await HiveReply.findByPk(replyId);
      if (!reply) return res.status(404).json({ msg: 'Reply not found' });

      const post = await HivePost.findByPk(reply.postId);
      if (!post) return res.status(404).json({ msg: 'Parent post not found' });

      group = await HiveGroup.findByPk(post.groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });
    }



    const io = req.app.get('io');
    const eventPayload = {
      postId: postId || null,
      replyId: replyId || null,
      userId: req.user.id,
      type: type // 'up' or 'down'
    };
    console.log(`Broadcasting reaction to group_${group.id}`, eventPayload);
    io.to(`group_${group.id}`).emit('newReaction', eventPayload);

    res.status(200).json({
      msg: created ? 'Reaction added' : 'Reaction updated',
      reaction: {
        id: reaction.id,
        type: reaction.type,
        target: postId ? 'post' : 'reply'
      }
    });

  } catch (err) {
    console.error('Error reacting:', err.message);
    res.status(500).json({ msg: 'Server error while reacting' });
  }
};

// Ultimate postcard: Post, Replies, Reactions, ...Counts ...
exports.getPostThread = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await HivePost.findByPk(postId, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profileDetails']
        },
        {
          model: HiveReaction,
          attributes: ['type']
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ msg: 'HivePost not found' });
    }

    const replies = await HiveReply.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profileDetails']
        },
        {
          model: HiveReaction,
          attributes: ['type']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    const countReactions = (arr = []) => {
      return {
        upVotes: arr.filter(r => r.type === 'up').length,
        downVotes: arr.filter(r => r.type === 'down').length
      };
    };

    const grouped = {};
    replies.forEach(reply => {
      const parentId = reply.parentReplyId || 'root';
      if (!grouped[parentId]) grouped[parentId] = [];
      grouped[parentId].push(reply);
    });

    const buildThread = (parentId = 'root') => {
      return (grouped[parentId] || []).map(reply => ({
        id: reply.id,
        user: reply.User,
        content: reply.content,
        createdAt: reply.createdAt,
        mediaUrl: reply.mediaUrl,
        tags: reply.tags,
        reactions: countReactions(reply.HiveReactions),
        replies: buildThread(reply.id)
      }));
    };

    res.status(200).json({
      post: {
        id: post.id,
        user: post.User,
        content: post.content,
        mediaUrl: post.mediaUrl,
        createdAt: post.createdAt,
        tags: post.tags,
        reactions: countReactions(post.HiveReactions)
      },
      replies: buildThread()
    });

  } catch (err) {
    console.error('Error fetching post thread:', err.message);
    res.status(500).json({ msg: 'Server error fetching post thread' });
  }
};
