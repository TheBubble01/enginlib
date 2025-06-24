const { User, Notification } = require('../models');

/**
 * Detect @username mentions in text
 * @param {string} text
 * @returns {Array<string>} array of usernames
 */
function extractMentions(text) {
  const matches = text.match(/@(\w+)/g);
  return matches ? matches.map(tag => tag.substring(1)) : [];
}

/**
 * Create notifications for mentioned users
 * @param {Object} options
 * @param {string} options.content - text that may contain mentions
 * @param {number} options.sourceUserId - user ID of the person who posted
 * @param {number} [options.postId] - optional HivePost ID
 * @param {number} [options.replyId] - optional HiveReply ID
 */
async function notifyMentions({ content, sourceUserId, postId = null, replyId = null }) {
  const usernames = extractMentions(content);
  if (!usernames.length) return;

  const sourceUser = await User.findByPk(sourceUserId);
  if (!sourceUser) return;

  for (let username of usernames) {
    const mentionedUser = await User.findOne({ where: { username } });
    if (!mentionedUser || mentionedUser.id === sourceUserId) continue;

    await Notification.create({
      userId: mentionedUser.id,
      postId,
      replyId,
      message: `@${sourceUser.username} mentioned you in a ${replyId ? 'reply' : 'post'}.`
    });
  }
}

module.exports = {
  extractMentions,
  notifyMentions
};
