# CampusConnect — College Placement Portal

A responsive individual project built with React, CSS, React Router, JSON sample data, and browser LocalStorage.

## Features
- Student dashboard with sample placement statistics
- Job opportunities, search, filters, sorting, eligibility filter, and saved jobs
- Apply to demo jobs and track application status
- Student profile form saved in LocalStorage
- Responsive desktop, tablet, and mobile layouts
- No external database required

## Requirements
- Node.js LTS
- VS Code (recommended)
- A modern browser

## Run the project
1. Extract the ZIP.
2. Open the `college-placement-portal` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Main files
- `src/data/jobs.json` — sample job listings
- `src/data/student.json` — demo student profile
- `src/App.jsx` — page components and interactions
- `src/style.css` — all styling and responsive layouts

## Important demo notes
- This is a frontend demonstration project, not a production placement system.
- Applications and saved jobs are stored in the current browser's LocalStorage, so they persist across refreshes on that browser.
- Job and student JSON files are imported as read-only sample data. React in the browser does not write changes back into these JSON files.
- Application status examples are illustrative. No real companies receive applications.
- The resume selector only demonstrates choosing a local file; it does not upload the file.
- Replace the demo student details and sample listings before presenting if needed.

## Build check
Run `npm run build` to create a production build in `dist/`.
