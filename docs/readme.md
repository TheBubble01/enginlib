# Enginlib - Faculty Library & Learning Hub

Welcome to **Enginlib**, a full-stack web application designed to serve as a digital library and collaborative learning hub for engineering students and staff. Built with robust access control, real-time communication, AI-assisted quiz generation, and clean UI/UX principles, Enginlib is crafted for scale and high usability.

---

## 🎯 Goals

- Centralize learning materials by department and course
- Enable intelligent quiz generation (AI + manual)
- Create a collaborative Hive forum per department
- Support real-time updates, offline caching, and a smooth PWA experience
- Empower admins and students with well-defined permissions

---

## 📦 Core Modules

### 1. **User Management & Roles**

- Tech Admin: Full access, manages all departments and app-level settings
- Regular Admin: Manages courses and forums within their department
- Student: Access to materials, quizzes, forums, and profile customization

### 2. **Course & Material Management**

- Upload, preview, download materials
- File validation by type and size
- Supports department-specific and general courses

### 3. **AI-Powered Quiz System**

- Generate quiz from readable material
- Prompt-based generation when material is not readable
- Manual quiz builder as fallback
- Save, edit, publish, submit, review flow

### 4. **The Hive - Discussion Forum**

- Auto-created forums per department
- Admins can create child chat groups (e.g., Level 100)
- Posts and threaded replies with tagging, media, reactions
- Mentions trigger saved notifications (with username attribution)
- Pinned messages supported with opt-in group toggle
- Pin status toggles with real-time updates, no notif on unpin
- Notifications include `isRead`, `expiresAt`, and unread count
- Posts expire after set lifespan and cleanup is automated (via cron)
- Real-time sync via Socket.IO for posts, replies, reactions, pin status

### 5. **Real-Time & Offline Support** *(Planned)*

- Real-time post/reply/reaction events using Socket.IO
- Future: service workers for PWA offline caching
- Push-style notifications via browser (planned once PWA is set up)

---

## 🛠️ Stack

- **Frontend:** React (PWA-ready), Tailwind CSS *(planned)*
- **Backend:** Node.js + Express
- **Database:** PostgreSQL via Sequelize ORM
- **Realtime:** Socket.IO
- **AI Integration:** OpenAI (for quiz generation - mocked for now)

---

## 📂 Project Structure (Backend)

```
enginlib-backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── uploads/
├── config/
├── app.js
├── package.json
```

---

## 🔐 Security

- JWT-based auth (`x-auth-token` in headers)
- Role-based access enforced via middleware
- Material upload restrictions
- Tag and pinned post notifications auto-expire with post lifespan
- Notifications can be marked as read, cleaned via scheduler

---

## ✅ Current Status

- 🔒 Auth & RBAC complete
- 📁 Material upload & preview/download working
- 🧠 AI quiz generation (mocked) works in 3 modes
- 💬 Hive module live with real-time threads
- 👍 Reactions + Mentions working live
- 📌 Pinned messages supported with notification preference toggle
- 🔔 Notification system enhanced with read state, expiry, cleanup-ready

---

## 📌 Notes

This project is actively developed by MJ and guided step-by-step by ChatGPT. Documentation is **kept in sync** with backend features.

For full module references, see `/docs`:

- [API\_OVERVIEW.md](./API_OVERVIEW.md)
- [QUIZ\_SYSTEM.md](./QUIZ_SYSTEM.md)
- [HIVE\_MODULE.md](./HIVE_MODULE.md)
- etc.

---

## 🚀 Next Steps

- 🔄 Mark notification as read, get unread count
- ⏰ Implement cron-based cleanup job for expired posts + notifs
- ✨ Tag highlight logic for frontend UI
- 🔔 Push-style delivery for persistent notifications *(after PWA setup)*
- 🧠 AI integration with OpenAI backend
- 🎨 Frontend PWA enhancements

