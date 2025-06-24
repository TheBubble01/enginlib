# 🐝 HIVE\_MODULE.md — The Hive (Discussion Forum)

This document covers the structure, rules, and real-time behavior of the Hive module in Enginlib.

---

## 🧭 Overview

- Each department has its own HiveForum
- Admins can create sub-groups (e.g., "Level 200")
- Posts and replies are threaded and collapsible
- Reactions, tagging, and live updates supported via Socket.IO

---

## 🗂 Structure

### HiveForum

- One per department

### HiveGroup

- Belongs to a HiveForum
- Named and described (e.g., "Level 100")

### HivePost

```js
{
  id, groupId, userId,
  content, mediaUrl, tags, lifespan,
  createdAt
}
```

- Lifespan default: 3 months (129600 minutes)
- Tech-admin can override lifespan

### HiveReply

```js
{
  id, postId, userId,
  content, mediaUrl, parentReplyId,
  tags
}
```

- Supports nested replies

### HiveReaction

```js
{
  id, postId | replyId,
  userId, type: 'up' | 'down'
}
```

---

## ⚡ Real-Time Events (Socket.IO)

### Events emitted to group rooms:

- `newPost`
- `newReply`
- `newReaction`

Each user connects to:

```js
socket.emit("joinGroup", groupId);
```

Server sends updates:

```js
io.to(`group_${groupId}`).emit('newPost', data);
io.to(`group_${groupId}`).emit('newReply', data);
io.to(`group_${groupId}`).emit('newReaction', data);
```

---

## ⏱ Post Lifespan

- All posts expire after 3 months
- Lifespan is stored in `minutes`
- Replies attached to deleted posts are also deleted
- Expiration jobs scheduled (planned via `node-cron`)

---

## 🔕 Notifications (Ephemeral + Persistent)

- Ephemeral: reactions, live updates (not saved)
- Persistent:
  - Tagged users in `@username` format
  - Pinned messages (admin-only)
  - Stored in DB
  - Cleaned up when post expires

---

## 🧠 Future Features

- Users can enable/disable push notifications per HiveGroup
- Admins can pin posts in their group
- Notification access like WhatsApp: even outside app
- Tagged users get linked back to post

---

## 🔐 Permissions

- All users can view, post, and reply
- Only admin can create HiveGroup
- Only post creator can delete their post (or admin)

For API usage, see API\_OVERVIEW\.md

