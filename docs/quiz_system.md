# 🧠 QUIZ_SYSTEM.md — Enginlib Quiz Module

This document outlines all quiz-related functionality, including generation, manual creation, submission, editing, and review logic.

---

## 🎯 Goals
- Enable quiz creation from multiple methods
- Support student submissions, drafts, and results
- Maintain flexibility and usability across roles

---

## 👨‍🏫 Admin Quiz Creation Modes

### 1. AI from Material
- Requires readable material (text extractable)
- Uses backend to check readability (`/api/ai/readability-check/:materialId`)
- If readable, sends to AI (mocked for now)
- Returns draft questions

### 2. AI from Prompt
- Admin provides topic/summary
- Prompt: e.g. _"Generate a 5-question quiz on basic thermodynamics"_
- AI returns draft quiz based on that topic

### 3. Manual Entry
- Admin adds questions manually
- For each question: `text`, options, correct flag

---

## 📥 Saving a Quiz
- All modes save to the same table:
  - `Quiz` → `QuizQuestions` → `QuizOptions`
- Quizzes can be published or saved as draft
- Can be edited, updated, deleted later

---

## 👩‍🎓 Student Experience

### GET `/api/quizzes/:id`
- Returns the entire quiz
- Loaded **once at the beginning** (offline-friendly)

### POST `/api/quizzes/:id/submit`
- Submit full quiz in one go
- Partial submissions allowed
- Saves `QuizSubmission` with `status: 'submitted'`

### Drafts
- Students can save their progress as a draft
- Drafts are stored in `QuizSubmission` with `status: 'draft'`
- Quiz can be submitted later

---

## 📊 Review Submission
### GET `/api/submissions/:id`
- Used by admin to review student results
- Includes:
  - Student's answers
  - Correct options
  - Score breakdown

---

## ✅ Key Rules
- Quizzes can be:
  - Published
  - Edited anytime
  - Deleted if needed

- Students:
  - Submit once
  - Save as draft
  - Submit partially if not all questions are answered

- Real AI not yet integrated (currently mocked)

---

## 📌 Notes
- Quiz system supports offline-first delivery (entire quiz fetched on load)
- Backend ensures validation of ownership, quiz availability, etc.
- Each creation mode shares the same save logic for consistency

