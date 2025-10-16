## 📔Campus Life Planner

A responsive web application for students to manage academic tasks with regex-powered search and validation.

### 🔗 Links

Github: @Lennie02
Repository: https://github.com/Lennie02/Summative_Building-Responsible-UI_Lennie.git

### ✨ Features

Add, edit, delete tasks with validation
Regex-powered search and filtering
Sort by date, title, or duration
Dashboard with statistics and 7-day trend
Weekly time budget tracking with ARIA live updates
Import/Export JSON with validation
LocalStorage persistence
Fully keyboard accessible
Mobile-first responsive design

### 🔐 Regex Patterns

1. Title Validation
Pattern: /^\S(?:.*\S)?$/
Advanced: /\b(\w+)\s+\1\b/i (detects duplicate words - back-reference)
Valid: Complete Assignment, Read Chapter Ten
Invalid:  Leading space, Study for for exam
2. Date Validation
Pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
Valid: 2025-10-20, 2025-01-15
Invalid: 2025-13-01, 25-10-20
3. Duration Validation
Pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/
Valid: 60, 90.5, 135.75
Invalid: 0, -10, 45.678
4. Tag Validation
Pattern: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
Valid: Assignment, Study Group, Study-Group
Invalid: Assignment123, Test_Tag

### ⌨️ Keyboard Navigation

Tab / Shift+Tab - Navigate elements
Enter - Activate buttons/links
Escape - Close modals
All interactive elements have visible focus indicators

### 📱 Responsive Breakpoints

Mobile: 360px - 767px (cards view)
Tablet: 768px - 1023px (table view, 2-col stats)
Desktop: 1024px+ (4-col stats, optimized layout)

### 📁 Project Structure
~~~
campus-life-planner/
├── index.html          # Main app
├── tests.html          # Validation tests
├── seed.json           # 12 sample tasks
├── README.md
├── styles/
│   └── main.css
└── scripts/
    ├── main.js
    ├── state.js
    ├── storage.js
    ├── validators.js
    ├── search.js
    └── ui.js
~~~
### 💾 Load Sample Data

Go to Settings → Data Management
Click Import JSON
Select seed.json
12 sample tasks will load

### 📊 Data Model
~~~
json
{
  "id": "task_1697000001",
  "title": "Complete Physics Assignment",
  "dueDate": "2025-10-20",
  "duration": 120,
  "tag": "Assignment",
  "createdAt": "2025-10-10T08:00:00.000Z",
  "updatedAt": "2025-10-10T08:00:00.000Z"
}
~~~
### 👨‍💻 Developer

Name: Orla Lennie ISHIMWE
Email: o.ishimwe1@alustudent.com
GitHub: @Lennie02

### 📹 Demo Video:

Built with: Vanilla JavaScript, CSS3, HTML5 




