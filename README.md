# 📚 StudyHub — Class 10 Resources

A free, beautiful study resources website for Class 10 students.

**Made with ♥ by Viraj Chavan**

---

## ✨ Features

- **4 Categories** — Notes · Practice Sheets · Textbook Solutions · Textbooks
- **8+ Subjects** — Science, Maths, History, Geography, Political Science, Economics, English, Hindi
- **Flipbook PDF Viewer** — Page-turn animation, keyboard navigation
- **NCERT Auto-fetch** — Class 10 NCERT textbooks linked automatically
- **Admin Panel** — Password-protected, add/remove files, export config
- **100% Free** — GitHub Pages hosting, no backend needed

---

## 🚀 Quick Setup (GitHub Pages)

### Step 1 — Fork / Clone this repo
```bash
git clone https://github.com/YOUR_USERNAME/studyhub.git
cd studyhub
```

### Step 2 — Update your GitHub username
Open `assets/js/data.js` and set your repo URL:
```js
const GITHUB_RAW = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/";
```

### Step 3 — Upload your PDFs
Organise files in this structure inside the repo:
```
notes/
  science/
    ch01-chemical-reactions.pdf
  maths/
    ch01-real-numbers.pdf
practice/
  science/
    ch01-practice.pdf
solutions/
  science/
    ch01-solutions.pdf
```

### Step 4 — Add resources via Admin Panel
1. Open `/admin/` on your site (default password: `StudyHub@2025`)
2. Add the GitHub raw URL for each file
3. Export the updated `data.js` and commit it to your repo

### Step 5 — Enable GitHub Pages
- Go to your repo **Settings → Pages**
- Source: **Deploy from a branch → main**
- Your site: `https://YOUR_USERNAME.github.io/studyhub/`

---

## 🔑 Changing Admin Password

In `/admin/index.html`, find:
```js
const ADMIN_PASSWORD = 'StudyHub@2025';
```
Change it to your own password.

---

## 📁 File Structure

```
studyhub/
├── index.html          ← Homepage (category cards)
├── browse.html         ← Subject/Chapter browser
├── admin/
│   └── index.html      ← Admin panel
├── assets/
│   ├── css/
│   │   └── style.css   ← Global styles
│   └── js/
│       ├── data.js     ← All resource data (EDIT THIS)
│       └── app.js      ← App logic
└── README.md
```

---

## 🌐 NCERT Textbooks

NCERT textbook links are pre-configured in `data.js` pointing to NCERT's official servers.
- If NCERT's server blocks direct embedding, files open in Google Docs viewer.
- Students can always download directly from NCERT.

---

## 📞 Credits

- Built by **Viraj Chavan**  
- PDF rendering: [Mozilla PDF.js](https://github.com/mozilla/pdf.js)  
- Fonts: [Google Fonts](https://fonts.google.com) — Cormorant Garamond + Outfit  
- Hosting: [GitHub Pages](https://pages.github.com)
