# AI usage

This project was built with AI assistance. This file records how I used AI as a development tool while building StudySprint Planner. I used AI mainly for guidance, debugging, code review, and suggestions while I made the decisions about the application's features, structure, testing, and final implementation.

## 1. How I used AI

### 2026-10-04 - Connecting the frontend to the backend

- **Tool:** ChatGPT
- **What I asked for:** I asked for guidance on transitioning StudySprint from the temporary mock API to the Express API and PostgreSQL implementation.
- **What it gave back:** It helped me identify which frontend API functions and backend routes needed to work together and suggested how the task fields should be passed between React, Express, and PostgreSQL.
- **What I kept, what I changed, and why:** I kept the separation between the frontend API layer and Express backend because it made the application easier to understand and test. I adapted the implementation to the task fields already used by StudySprint and tested the API independently before relying on it from the frontend.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/cc2377a810435e34de5d1ba284db5befcaefb092

### 2026-10-04 - Debugging the task due date

- **Tool:** ChatGPT
- **What I asked for:** I asked for help investigating why task due dates displayed incorrectly after the application started using the real PostgreSQL API.
- **What it gave back:** It pointed me toward the difference between the date value returned by the API and the way the React component was constructing a JavaScript Date.
- **What I kept, what I changed, and why:** I inspected the actual API response and the date-rendering code before changing it. I removed the unnecessary date manipulation and tested the result with the deployed data to make sure the displayed date was correct.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/eddfd0f

### 2026-10-04 - Planning the multi-page interface

- **Tool:** ChatGPT
- **What I asked for:** I asked how I could expand the original single-page interface without making the application unnecessarily complicated.
- **What it gave back:** It suggested using React Router and separating the application into Dashboard, Tasks, and About pages.
- **What I kept, what I changed, and why:** I used the multi-page approach because it made the task-management interface easier to navigate. I decided what information belonged on each page and kept task creation and task organization together on the Tasks page so users would not need to move between separate screens for closely related actions.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/e0c978c90b039ca3b099c364a032983e604a8335

### 2026-10-04 - Adding task filters and improving the interface

- **Tool:** ChatGPT
- **What I asked for:** I asked for suggestions on making the task list easier to read and organize.
- **What it gave back:** It suggested status filters and UI improvements for distinguishing active and completed tasks.
- **What I kept, what I changed, and why:** I implemented All, Active, and Completed filters because they directly supported the purpose of the planner. I also chose a consistent blue theme and adjusted the layout to keep the application simple instead of adding features that were not necessary for the project.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/e0c978c90b039ca3b099c364a032983e604a8335

### 2026-10-04 - Implementing task editing

- **Tool:** ChatGPT
- **What I asked for:** I asked for guidance on adding an Edit function to the existing Tasks page while continuing to use the same Express API and PostgreSQL data.
- **What it gave back:** It suggested using the existing update API function and loading the selected task's values into an edit form before sending the updated values to the backend.
- **What I kept, what I changed, and why:** I kept the existing API structure instead of creating a second system specifically for editing. I tested editing against the real database and made sure the task list reflected the updated values after saving.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/0536cc996a1aa9f3c47e13b6d9363cc8713a4d66

### 2026-10-04 - Fixing routing on GitHub Pages

- **Tool:** ChatGPT
- **What I asked for:** I asked why Dashboard navigation worked normally but refreshing the Tasks or About page on the live GitHub Pages site returned a 404.
- **What it gave back:** It explained that client-side BrowserRouter paths were being interpreted by GitHub Pages as real server paths and suggested hash-based routing for this deployment.
- **What I kept, what I changed, and why:** I changed the application to HashRouter because it solved the refresh problem without requiring another hosting configuration. I tested both Tasks and About directly on the deployed site and confirmed that refreshing no longer produced a 404.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/aee025ec26ca58aefbdf801a95f6bac336d27f86

## 2. Where the AI got it wrong

### Case 1 - Date formatting assumption

- **What it gave me:** During development, the suggested frontend date handling assumed that the task's `due_date` needed an additional `T00:00:00` value before being passed to `Date`.
- **What was wrong with it:** After connecting the application to PostgreSQL, the API was already returning a complete date/time value. Adding another time portion produced an invalid date in the interface.
- **What I did instead:** I checked the actual JSON returned by `/api/tasks`, compared it with the code in `App.jsx`, and changed the frontend to use the returned date value correctly.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/eddfd0f

### Case 2 - GitHub Pages routing

- **What it gave me:** The initial multi-page implementation used `BrowserRouter`, which worked while navigating through the application.
- **What was wrong with it:** On GitHub Pages, refreshing `/tasks` or `/about` caused a 404 because GitHub Pages tried to resolve those routes as actual paths instead of allowing React to handle them.
- **What I did instead:** I reproduced the problem on the live deployment, identified that it only happened on direct route loading or refresh, and changed the application to use `HashRouter`. I then tested both routes again on the deployed site.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/aee025ec26ca58aefbdf801a95f6bac336d27f86

### Case 3 - Public repository documentation

- **What it gave me:** AI-assisted documentation initially suggested putting developer information in the public README and About page.
- **What was wrong with it:** After reviewing the course instructions, I found that the public project repository should not contain personal identifying information. The project documentation therefore needed to follow the course privacy requirement instead of the generic README suggestion.
- **What I did instead:** I reviewed the course requirements again and removed personal information from the public-facing project documentation while keeping project information and AI disclosure where required.
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/3ab149e

## 3. Who wrote what

### Written by me

- **File:** `client/src/pages/Tasks.jsx`
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/0536cc996a1aa9f3c47e13b6d9363cc8713a4d66
- **What it does and why it is built this way:** I worked on the task-management behavior and decisions for this page, including how users add, view, edit, complete, reopen, filter, and delete tasks. I kept these related actions together because I wanted the Tasks page to be the main workspace instead of making the user move between several pages for basic task operations. I also tested these actions with the deployed API to make sure changes persisted in PostgreSQL.

### The AI-written part I understand best

- **File:** `client/src/App.jsx` and `client/src/main.jsx`
- **Commit:** https://github.com/merwwki/StudySprint-Planner/commit/aee025ec26ca58aefbdf801a95f6bac336d27f86
- **What it does and why we kept it:** These files define the main application routes and initialize React Router. I understand that `HashRouter` stores the client-side route after a `#` in the URL. GitHub Pages therefore continues requesting the actual deployed `index.html` instead of treating `/tasks` or `/about` as files on its server. React Router then reads the part after the hash and displays the correct page. We kept this approach because it is simple and works reliably with GitHub Pages.