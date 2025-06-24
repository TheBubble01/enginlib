# 📘 API\_OVERVIEW\.md — Enginlib API Endpoints

This document outlines all the RESTful API routes in the Enginlib backend. Each route includes:

- Purpose
- Role-based access
- Expected request/response
- Route path and HTTP method

---

## 🔐 Auth

### POST `/api/auth/register/:role`

- Register a new user based on role (student, admin, tech-admin)
- `role` from route param defines permissions

### POST `/api/auth/login/:role`

- Login using role-specific endpoints (e.g., `/login/student`)

### PUT `/api/user/profile`

- Update profile (fullName, username, profilePicture)

### POST `/api/auth/reset-password`

- Send reset email (SMTP or Mailtrap)

---

## 🏫 Departments

### POST `/api/departments`

- Tech-admin only
- Create a new department (auto-generates Hive forum)

### GET `/api/departments`

- All roles
- List all departments

### PUT `/api/departments/:id`

- Tech-admin or allowed admin

---

## 📘 Courses

### POST `/api/courses`

- Admin only
- Create new course (departmental or general)
- Course code is unique **per department**

### GET `/api/courses`

- Supports filters: `department`, `level`, `semester`

### PUT `/api/courses/:id`

- Admin-only

### DELETE `/api/courses/:id`

- Admin-only

---

## 📁 Materials

### POST `/api/materials/upload`

- Admin only
- Upload course material
- Accepts: PDF, DOC, PPT, EXCEL, IMAGES, VIDEO (video max: 50MB)

### GET `/api/materials/preview/:id`

- Public
- Return preview (text for AI or short HTML preview)

### GET `/api/materials/download/:id`

- Public
- Force download

---

## 🧠 AI Quiz System

### GET `/api/ai/readability-check/:materialId`

- Checks if file is readable (e.g., not image-based)

### POST `/api/ai/generate-from-material`

- AI generates quiz from readable content

### POST `/api/ai/generate-from-prompt`

- AI generates quiz from admin prompt

### POST `/api/ai/save-from-ai`

- Save quiz generated from AI (either mode)

---

## ❓ Quiz Management

### POST `/api/quizzes/manual`

- Manually create quiz with questions/options

### PUT `/api/quizzes/:id/update`

- Update quiz title/questions/options

### DELETE `/api/quizzes/:id`

- Delete quiz

### GET `/api/quizzes/:id`

- Fetch quiz details (for students)

### POST `/api/quizzes/:id/submit`

- Student submits quiz

### GET `/api/submissions/:id`

- Admin fetches student result for review

---

## 🐝 The Hive (Discussion Forum)

### GET `/api/hive/forums/:forumId/groups`

- Lists all child groups under a department

### POST `/api/hive/forums/:forumId/groups`

- Admin creates a new group

### POST `/api/hive/groups/:groupId/posts`

- User creates a post (lifespan = 3 months default)

### GET `/api/hive/groups/:groupId/posts`

- Paginated, sorted post feed

### POST `/api/hive/posts/:postId/replies`

- Create a threaded reply

### POST `/api/hive/react`

- Thumbs up/down a post or reply (real-time broadcast)

---

## 🔧 Utilities

### Protected Headers

Always attach:

```http
x-auth-token: <JWT>
```

---

## 🟢 Real-Time Events via Socket.IO

| Event         | Sent By | Payload Format                                |
| ------------- | ------- | --------------------------------------------- |
| `newPost`     | Server  | `{ id, content, user, createdAt }`            |
| `newReply`    | Server  | `{ replyId, postId, content, parentReplyId }` |
| `newReaction` | Server  | `{ postId or replyId, userId, type }`         |

> These events are scoped by group room: `group_<groupId>`

---

For DB schema, see [`DATABASE_MODELS.md`](./DATABASE_MODELS.md)

