# 📁 MATERIALS.md — Material Upload, Preview & Download

This document outlines the logic for handling course materials in Enginlib.

---

## 📤 Uploading Material

### Endpoint

```
POST /api/materials/upload
```

### Access

- Only admins (tech or regular)

### Fields

- `file`: the uploaded material
- `courseId`: associated course

### File Type Support

- PDF
- DOC/DOCX
- XLS/XLSX
- PPT/PPTX
- IMAGES (JPG, PNG, etc.)
- VIDEO (MP4, MOV, etc.)

### Validation

- Only **one file** per upload
- Max video size: **50MB**
- Other file types: unrestricted (server handles MIME check)

### Clear Error Messages

- Uploading more than one file → `Only one file can be uploaded`
- Invalid file type → `Unsupported file type`
- Video size exceeded → `Video files must be under 50MB`

---

## 👁️ Previewing Materials

### Endpoint

```
GET /api/materials/preview/:id
```

### Returns:

```json
{
  readable: true,
  preview: "This material explains...",
  charCount: 10243,
  canGenerateQuiz: true
}
```

### If unreadable:

```json
{
  readable: false,
  reason: "No extractable text found",
  canGenerateQuiz: false
}
```

---

## ⬇️ Downloading Material

### Endpoint

```
GET /api/materials/download/:id
```

### Behavior

- Forces download via browser
- Automatically names the file
- Works for videos and other media

> ⚠️ Postman **does not trigger downloads** — test in browser

---

## 💡 Design Considerations

- Materials stored in `uploads/`
- Stored metadata includes fileSize, fileType
- Used by AI quiz generator

---

For associated models, see [`DATABASE_MODELS.md`](./DATABASE_MODELS.md)

