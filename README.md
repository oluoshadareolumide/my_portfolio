# 🍎 Olumide Olu-Oshadare — Retro Mac OS Portfolio

> An interactive personal portfolio disguised as a vintage Macintosh / early macOS desktop environment. Built with React. Inspired by legacy Apple design from Mac OS 9 and early Mac OS X Aqua.

---

## ✨ Features

- **Boot Screen** — Animated Apple logo pulse with a progress bar and system status messages
- **Login Screen** — Starfield background with a glossy Aqua-style login card
- **Interactive Desktop** — Draggable, focusable, and minimisable app windows
- **Menu Bar** — Live clock, battery/WiFi indicators, and dropdown menus (🍎, File, Go, Window)
- **Dock** — Animated icon dock with hover magnification and open-app indicators
- **Desktop Icons** — Right-rail icons for HD, Projects, and Trash
- **Shutdown Flow** — Apple menu → Shut Down loops back to the boot sequence
- **Five Portfolio Windows:**
  - 👤 **About Me** — Bio, title, and contact info
  - 📄 **Résumé** — Skills, experience, education, and CV download
  - 🗂️ **Projects** — Folder grid with clickable project detail modals
  - ✉️ **Contact** — Social links and a working contact form
  - 🖥️ **System Profiler** — Fun hardware overview and tech stack

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/oluoshadareolumide/mac-portfolio.git
cd mac-portfolio

# Install dependencies
npm install
```

### Run in Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Styling | Tailwind CSS + inline styles |
| Bundler | Vite |
| Icons | Emoji (no external icon library needed) |
| Fonts | Geneva, Lucida Grande, Helvetica Neue |

---

## 📁 Project Structure

```
mac-portfolio/
├── public/
│   └── favicon.ico
├── src/
│   ├── MacPortfolio.jsx   ← Main component (entire app)
│   └── main.jsx           ← React entry point
├── index.html
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Create the Vite + React project

```bash
npm create vite@latest mac-portfolio -- --template react
cd mac-portfolio
npm install
```

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Drop in the component

Copy `MacPortfolio.jsx` into `src/` and update `src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './MacPortfolio'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 4. Run it

```bash
npm run dev
```

---

## 🎨 Customisation

All personal data is stored in constants at the top of `MacPortfolio.jsx`. Edit these to update the portfolio content without touching any UI code.

| Constant | What it controls |
|---|---|
| `OWNER` | Name, title, email, phone, LinkedIn, GitHub, bio |
| `SKILLS` | Core skills list shown in the Résumé window |
| `EXPERIENCE` | Work history entries |
| `EDUCATION` | Degree / institution entries |
| `PROJECTS` | Project cards (name, icon, description, tags) |
| `TECH` | Technical proficiency rows in System Profiler |

### Adding a CV Download

In the `ResumeContent` component, replace the `onClick` handler on the download button:

```jsx
onClick={() => window.open('/cv/Olumide_CV.pdf', '_blank')}
```

Place your PDF at `public/cv/Olumide_CV.pdf`.

---

## 🌐 Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the dist/ folder into Netlify's dashboard
```

### GitHub Pages

```bash
npm install -D gh-pages
```

Add to `package.json`:

```json
"homepage": "https://oluoshadareolumide.github.io/mac-portfolio",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

```bash
npm run deploy
```

---

## 📱 Responsive Notes

The portfolio is **desktop-first** by design — the OS metaphor works best on larger screens. On smaller screens, windows will still open and scroll, but the dragging experience is optimised for mouse/trackpad. Touch dragging on mobile is limited.

---

## 📄 Licence

MIT — free to use, modify, and deploy.

---

## 👤 Author

**Olumide Olu-Oshadare**
- Email: [oluoshadare.olumide@gmail.com](mailto:oluoshadare.olumide@gmail.com)
- LinkedIn: [linkedin.com/in/olu-oshadare-olumide](https://www.linkedin.com/in/olu-oshadare-olumide/)
- GitHub: [github.com/oluoshadareolumide](https://github.com/oluoshadareolumide)

---

*"Making technology feel human, one interface at a time."*
