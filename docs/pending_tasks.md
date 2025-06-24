# 📝 PENDING_TASKS.md — Features To Be Implemented

This document tracks remaining major features and enhancements for the Enginlib backend.

---

## 🔔 Tagging and Notifications
- [ ] Detect `@username` in Hive posts/replies
- [ ] Create saved notifications for tagged users
- [ ] Notification expires when post is deleted or expires

---

## 📌 Pinned Messages
- [ ] Allow admins to pin a message in a HiveGroup
- [ ] Add toggle per user: "receive pinned post alerts"
- [ ] Push-style alert even outside app

---

## 🗑 Post Expiry Cleanup
- [ ] Schedule background job using `node-cron`
- [ ] Delete expired posts and their replies automatically
- [ ] Also clean related notifications

---

## 🤖 AI Integration
- [ ] Connect to real OpenAI API (currently mocked)
- [ ] Secure API key usage
- [ ] Cost/error handling fallback

---

## 📴 Offline + PWA Frontend
- [ ] Implement service worker for static/dynamic caching
- [ ] Support offline quiz taking
- [ ] Sync replies/answers on reconnect
- [ ] Show connection status banner

---

## 📲 Push Notification Delivery
- [ ] Use Web Push or Firebase
- [ ] Deliver persistent notifications outside app
- [ ] Tag mention, reply, or pin should trigger this

---

## 🎓 Student Contributions
- [ ] Allow students to suggest or upload materials
- [ ] Admins can approve/reject

---

## 🧪 Test Coverage & Error Logging
- [ ] Add request-level logging (winston/morgan)
- [ ] Add more automated tests per module
- [ ] Handle common 404/403/500 errors gracefully

