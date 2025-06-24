const { Notification, HivePost, HiveReply } = require('../models');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        { model: HivePost, attributes: ['id', 'content'] },
        { model: HiveReply, attributes: ['id', 'content'] }
      ]
    });

    res.json({ notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ msg: 'Server error while fetching notifications' });
  }
};
