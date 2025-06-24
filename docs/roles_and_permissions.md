# 🛡️ ROLES_AND_PERMISSIONS.md — Enginlib User Roles

This document defines all user roles and what they are allowed to do.

---

## 👤 Roles Overview

| Role         | Description |
|--------------|-------------|
| `tech-admin` | System-level admin. Can manage all departments and users |
| `admin`      | Regular admin, manages courses/materials in their department |
| `student`    | Access-only role. Can interact with courses, materials, quizzes, Hive |

---

## ✅ Tech Admin Permissions
- Create/update/delete departments
- Control whether regular admins can edit department settings
- Manage general courses
- Pin messages in any HiveGroup
- Override post lifespan

---

## ✅ Regular Admin Permissions
- Manage courses/materials in their department
- Create quizzes (AI/manual)
- Manage HiveGroups under their forum
- Pin messages in their HiveGroup (if allowed)
- View student submissions

---

## ✅ Student Permissions
- View courses from all departments
- See own department by default
- Access all materials (download/preview)
- Take quizzes (save/submit/review)
- Post and reply in Hive
- React and tag users

---

## 🔒 Protected Routes
- All routes require `x-auth-token` header
- Admin-level routes protected by `roleMiddleware`

```js
roleMiddleware(['tech-admin'])
roleMiddleware(['admin', 'tech-admin'])
```

---

## 🧠 Notes
- A user’s role is defined during registration (via route)
- Profile update is allowed for all
- Users cannot self-promote roles

