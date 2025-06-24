# 📴 OFFLINE_SUPPORT.md — Offline Caching & Sync Plan

This document outlines the strategy to make Enginlib progressively offline-ready using PWA patterns.

---

## 🌐 Goal
- Enable offline quiz-taking and content access
- Ensure real-time updates resume once reconnected

---

## ✅ Current Status
- React frontend PWA mode planned
- Quiz loads entire data in one request
- Real-time post events integrated (Socket.IO)

---

## 🧱 Service Worker Strategy (Planned)

### Static Caching (App Shell)
- Cache main UI shell and CSS

### Dynamic Caching
- Material previews (text)
- Course data and quiz JSON
- Discussion posts and threads

### Expiration
- Use `Cache-Control` headers or indexedDB TTL logic

### Workbox Strategy (Recommended)
- Use Workbox to manage:
  - `networkFirst` for posts
  - `cacheFirst` for materials

---

## 🧪 Sync Strategy
- Store pending quiz submissions or replies in local DB
- On reconnect:
  - Send to server via API
  - Notify user of successful sync

---

## 🔁 Real-Time Reconnection
- Socket.IO handles reconnection automatically
- Frontend detects `disconnect` / `reconnect` events

---

## 🧠 UX Considerations
- When offline:
  - Show offline banner
  - Disable post creation until synced (optional)
- When reconnected:
  - Trigger background sync

---

## 🔐 Security
- JWT token refresh handled via frontend storage (local/session)
- Warn users if token expires during offline period

---

> Full PWA support will be implemented in the frontend phase after backend stability

For API support, see [`QUIZ_SYSTEM.md`](./QUIZ_SYSTEM.md), [`MATERIALS.md`](./MATERIALS.md)

