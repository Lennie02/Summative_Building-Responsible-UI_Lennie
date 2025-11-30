# Campus Life Planner 📚

A comprehensive, accessible task management application for students to organize assignments, track deadlines, and manage their academic workload.

**Live Demo:** [https://lennie02.github.io/campus-life-planner](https://lennie02.github.io/campus-life-planner)

---

## 📋 Overview

Campus Life Planner is a vanilla JavaScript web application built for the ALU Summative Assignment - Building Responsive UI. It features task management, regex-powered search, time tracking, and full accessibility support.

**Theme Chosen:** Campus Life Planner (Tasks/Events, Durations, Tags, Search)

---

## ✨ Features

- **Task Management**: Create, edit, and delete tasks with durations and due dates
- **Advanced Search**: Regex-powered search with pattern matching and highlighting
- **Smart Sorting**: Sort by date, title, or duration
- **Time Tracking**: Weekly time budget with visual progress
- **Data Persistence**: localStorage with JSON import/export
- **Full Accessibility**: Keyboard navigation and screen reader support
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first (360px, 768px, 1024px breakpoints)

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser
- Local web server (required for ES6 modules)

### Setup (VS Code Live Server - Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Lennie02/campus-life-planner.git
   cd campus-life-planner
   ```

2. Install VS Code "Live Server" extension

3. Right-click `index.html` → "Open with Live Server"

### Alternative: Python
```bash
python -m http.server 8000
# Open: http://localhost:8000
```

### Load Sample Data
Settings → Import JSON → Select `sample_tasks.json`

---

## 📊 Data Model

```json
{
  "id": "task_1697000001",
  "title": "Complete Physics Assignment",
  "dueDate": "2025-10-20",
  "duration": 120,
  "tag": "Assignment",
  "createdAt": "2025-10-10T08:00:00.000Z",
  "updatedAt": "2025-10-10T08:00:00.000Z"
}
```

---

## 🔍 Regex Patterns Catalog

### 1. Title Validation
**Pattern:** `^\S(?:.*\S)?$`  
**Purpose:** No leading/trailing spaces

**Examples:**
- ✅ `"Complete Assignment"`
- ❌ `" Leading space"`
- ❌ `"Trailing space "`

**Advanced - Duplicate Words (Back-reference):**  
**Pattern:** `\b(\w+)\s+\1\b` (Flags: `i`)

**Examples:**
- ✅ `"Study for exam"`
- ❌ `"Study for for exam"`

---

### 2. Date Validation
**Pattern:** `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`  
**Purpose:** YYYY-MM-DD format validation

**Examples:**
- ✅ `"2025-10-20"`
- ❌ `"2025-13-01"` (invalid month)
- ❌ `"25-10-20"` (wrong format)

---

### 3. Duration Validation
**Pattern:** `^(0|[1-9]\d*)(\.\d{1,2})?$`  
**Purpose:** Positive numbers, max 2 decimals

**Examples:**
- ✅ `"60"`, `"90.5"`, `"45.25"`
- ❌ `"0"`, `"-10"`, `"45.678"`

---

### 4. Tag Validation
**Pattern:** `^[A-Za-z]+(?:[ -][A-Za-z]+)*$`  
**Purpose:** Letters, spaces, hyphens only

**Examples:**
- ✅ `"Assignment"`, `"Study Group"`, `"Study-Group"`
- ❌ `"Assignment123"`, `"Test_Tag"`

---

### 5. Search Patterns

**Simple Search:**
```regex
Input: assignment
Compiled: /assignment/gi
Matches: "Complete Assignment", "assignment due"
```

**Tag Search:**
```regex
Input: ^@tag:\w+
Matches: "@tag:homework", "@tag:exam"
```

**Time Pattern:**
```regex
Input: \b\d{2}:\d{2}\b
Matches: "Meeting at 14:30", "Due 09:00"
```

**Multiple Keywords:**
```regex
Input: assignment|homework|quiz
Matches: Any of the three keywords
```

---

## ⌨️ Keyboard Navigation

| Shortcut | Action |
|----------|--------|
| `Tab` / `Shift+Tab` | Navigate forward/backward |
| `Enter` / `Space` | Activate buttons/links |
| `Escape` | Close dialogs |
| `Ctrl/Cmd + N` | New task |
| `Ctrl/Cmd + S` | Save task |

**Full keyboard-only operation supported throughout the app.**

---

## ♿ Accessibility Features

### Semantic HTML
- Proper landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Heading hierarchy (h1 → h2 → h3)
- Labels bound to inputs

### ARIA Attributes
- Live regions for status announcements (`aria-live="polite"` / `"assertive"`)
- Dialog roles (`role="dialog"`, `aria-modal="true"`)
- Descriptive labels (`aria-label`, `aria-describedby`)

### Visual
- Visible focus indicators (2px outline)
- WCAG AA color contrast ratios
- Skip-to-content link

### Screen Reader Support
- Error messages announced
- Form validation feedback
- Status updates

---

## 🧪 Testing

### Run Tests
Open `tests.html` → Click "Run All Tests"

**36 total tests covering:**
- Title validation (7 tests)
- Date validation (7 tests)
- Duration validation (7 tests)
- Tag validation (8 tests)
- Regex compilation (7 tests)

### Manual Testing
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Search and sort functionality
- ✅ Import/Export JSON
- ✅ Keyboard-only navigation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode toggle

---

## 📁 File Structure

```
campus-life-planner/
├── index.html              # Main app page
├── tests.html              # Test suite
├── sample_tasks.json       # Sample data (12 tasks)
├── styles/
│   ├── main.css           # Light mode styles
│   └── darkmode.css       # Dark mode with CSS variables
└── scripts/
    ├── main.js            # App initialization
    ├── ui.js              # DOM manipulation
    ├── state.js           # State management
    ├── storage.js         # localStorage operations
    ├── validators.js      # Regex validation
    ├── search.js          # Search/filter/sort
    ├── theme.js           # Theme toggle
    └── dialog.js          # Delete confirmation
```

---

## 🛠 Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, CSS Variables
- **JavaScript ES6+** - Modules, no frameworks
- **localStorage** - Data persistence

---

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires JavaScript enabled

---

## 👨‍💻 Author

**Orla Lennie Ishimwe**  
📧 Email: [o.ishimwe1@alustudent.com](mailto:o.ishimwe1@alustudent.com)  
💻 GitHub: [github.com/Lennie02](https://github.com/Lennie02)

---

## 📝 License

This project was created as part of the ALU Summative Assignment - Building Responsive UI.

---

## 🎥 Demo Video

[Watch Demo Video (2-3 min)](https://your-video-link-here.com) - Shows keyboard navigation, regex search, import/export, and responsive design.

---

**Note:** This application uses ES6 modules and must be run through a web server (not `file://`). See [Quick Start](#-quick-start) for setup instructions.
