# 📓 DEV_NOTES.md — Developer Design Notes

This file includes reasoning behind major design choices in the Enginlib project.

---

## ✅ API Design
- **RESTful, grouped by resource**
- Versioning omitted for now (v1 assumed)
- `/api/<module>` namespace keeps things clean

---

## 🔐 Role-Based Access (RBAC)
- All routes protected by `authMiddleware`
- Extra middleware (`roleMiddleware`) restricts access per role
- Role is defined during login (`/auth/login/:role`)

---

## 🧠 Quiz Design Rationale
- Support 3 creation modes (AI x2 + Manual)
- Save structure is identical regardless of source
- Drafts + full submissions allow flexibility

---

## 🐝 Hive Real-Time Logic
- Socket.IO server attached via `app.set('io', io)`
- Events scoped to `group_<groupId>`
- Reactions, posts, replies all live-broadcast

---

## 📦 Materials Handling
- `multer` used for file upload
- MIME type checked at backend
- Preview extract uses `pdf-parse`, `textract` or fallback logic
- Force-download set via `res.download()`

---

## 🧹 Expiration
- Posts expire via `lifespan` (stored in minutes)
- Tech-admin can override default
- Future: scheduled jobs (`node-cron`) to clean expired posts and related replies

---

## 🧪 Testing Notes
- Postman used for every route (auth, headers included)
- Preview is tested using sample PDFs and Word docs
- Socket.IO tested via simple `socket-test.html`

---

## 🛠 Dev Best Practices
- All responses have clear error messages
- Status codes follow REST spec
- Validation and cleanup logic centralized in controller
- Consistent naming for group/post/reply throughout

---

## 🧪 Debugging Real-Time
- Use browser console + terminal log (`Emitting to room:`)
- Ensure `joinGroup()` is called **after** connection
- Always match `groupId` in test page with Postman

---

> Docs are updated as the system evolves

