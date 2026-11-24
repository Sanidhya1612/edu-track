# EduTrack — Mentor Student Monitoring Dashboard

**Live Demo:** [edutrackk-ay8c.vercel.app](https://edutrackk-ay8c.vercel.app)

EduTrack is a web-based dashboard designed to help college mentors manage student records, monitor academic status, identify at-risk students, and maintain student remarks in one place.

## Features
* **Mentor Login:** Login system with support for multiple mentor accounts.
* **Dashboard Overview:** Summary cards showing Total, Active, At-Risk, Inactive, and Completed students.
* **Excel Integration:** Uploads and manages separate Excel datasets (`file1.xlsx` and `file2.xlsx`) without merging them.
* **Search & Filters:** Find students using ID, Name, Email, Course, or Mentor, with status and mentor filters.
* **Student Profiles:** View student details, update academic status, and add internal mentor remarks.
* **Data Saving & Export:** Saves changes in browser Local Storage and exports updated records to Excel.

## Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript
* **Excel Processing:** [SheetJS (xlsx)](https://sheetjs.com/)
* **Deployment:** Vercel

## Project Structure
```text
├── data/
│   ├── file1.xlsx
│   └── file2.xlsx
├── index.html
├── style.css
├── app.js
└── README.md
```
