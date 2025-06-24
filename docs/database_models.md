# 🧩 DATABASE\_MODELS.md — Enginlib Schema Design

This document describes all Sequelize models in Enginlib, their fields, associations, and rationale.

---

## 👤 User

```js
User {
  id, username, email, password,
  fullName, profilePicture, profileDetails: JSON,
  role: ['student', 'admin', 'tech-admin'],
  departmentId
}
```

- 🔐 Handles RBAC
- Used for tagging, posting, and ownership

---

## 🏫 Department

```js
Department {
  id, name, description,
  logo, customizations (themes/styles)
}
```

- Each department auto-generates a HiveForum
- Admins belong to departments

---

## 📘 Course

```js
Course {
  id, title, description, courseCode,
  isGeneral: boolean, departmentId (nullable),
  level, semester, uploadedBy
}
```

- `isGeneral = true` → no departmentId required
- Unique `courseCode` per department

---

## 📁 Material

```js
Material {
  id, filePath, fileSize, fileType,
  uploadedBy, courseId, previewExtract, createdAt
}
```

- Supports PDF, Word, Excel, PowerPoint, videos
- Max video size: 50MB
- Preview logic extracts readable text (or fallback)

---

## 🧠 Quiz

```js
Quiz {
  id, title, courseId, createdBy,
  isPublished: boolean
}
```

- Created by admin or AI

## ❓ QuizQuestion & QuizOption

```js
QuizQuestion {
  id, quizId, text
}

QuizOption {
  id, questionId, text, isCorrect: boolean
}
```

## 📤 QuizSubmission

```js
QuizSubmission {
  id, quizId, studentId, answers: JSON,
  score, submittedAt, status: 'draft' | 'submitted'
}
```

---

## 🐝 HiveForum / HiveGroup

```js
HiveForum {
  id, departmentId
}

HiveGroup {
  id, forumId, name, description
}
```

- One HiveForum per department
- Child HiveGroups (like Level 100) are created by admin

## 📝 HivePost & HiveReply

```js
HivePost {
  id, groupId, userId, content, mediaUrl,
  lifespan: minutes (default: 129600),
  tags: [@username1, @username2], createdAt
}

HiveReply {
  id, postId, userId, content, mediaUrl,
  parentReplyId, tags: [], createdAt
}
```

## 👍 HiveReaction

```js
HiveReaction {
  id, postId or replyId, userId, type: 'up' | 'down'
}
```

---

## Relationships (Associations)

- `User.belongsTo(Department)`
- `Department.hasMany(Course)`
- `Course.hasMany(Material)`
- `Quiz.hasMany(QuizQuestion)`
- `QuizQuestion.hasMany(QuizOption)`
- `Quiz.hasMany(QuizSubmission)`
- `HiveForum.belongsTo(Department)`
- `HiveGroup.belongsTo(HiveForum)`
- `HivePost.belongsTo(HiveGroup)`
- `HivePost.hasMany(HiveReply)`
- `HiveReply.belongsTo(HivePost)`
- `HiveReply.belongsTo(HiveReply, { as: 'parent' })`
- `HiveReaction.belongsTo(HivePost or HiveReply)`

---

For endpoint usage, see API\_OVERVIEW\.md

