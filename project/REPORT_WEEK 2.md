# Weekly Increment Report

## Week of: September 30, 2026

## What changed this week

- Continued development of the StudySprint Planner frontend.
- Improved the layout and organization of the main StudySprint Planner interface.
- Refined the task creation form and task display functionality.
- Improved the handling of study task information, including titles, subjects, descriptions, due dates, priorities, and completion status.
- Continued testing the task creation, display, deletion, and localStorage functionality.
- Reviewed the existing frontend code and project structure in preparation for backend development.
- Started setting up the Express backend for the StudySprint Planner.
- Created the initial backend project structure and API configuration.
- Began replacing the temporary mock API approach with the planned Express API.
- Reviewed the requirements for connecting the application to a PostgreSQL database.
- Prepared the project structure and environment variables needed for backend and database development.
- Continued updating the project documentation based on the progress made during Week 2.

## Why

These changes were made to move the StudySprint Planner from a frontend prototype toward a complete full-stack application. After establishing the basic task-management interface during Week 1, the focus for Week 2 was to prepare the backend and database components required by the project. This provides the foundation for storing and managing study tasks through a real API instead of relying only on mock data and localStorage.

## What broke or what I got stuck on

- I initially had difficulty understanding how the Express backend should communicate with the React/Vite frontend.
- I was unsure about how the PostgreSQL database should be structured and how the task fields from the frontend should correspond to database columns.
- I encountered some confusion when organizing the frontend and backend files because they use different configurations and dependencies.
- I had to review the environment variable setup to understand how the frontend and backend should communicate without hardcoding configuration values.
- Some existing frontend functionality still depended on the mock API, so additional changes were needed before the application could fully transition to the Express backend.
- I also had to spend additional time understanding how the API routes would handle creating, retrieving, updating, and deleting study tasks.

## What is left

- Complete the Express backend implementation.
- Finalize the PostgreSQL database and task table structure.
- Implement the required CRUD API endpoints for study tasks.
- Connect the React frontend to the Express backend.
- Replace the remaining mock API functionality with the real backend API.
- Test communication between the frontend, backend, and database.
- Continue improving the user interface and task-management features.
- Add and test task completion functionality.
- Complete the remaining project documentation.
- Prepare the application for deployment and final testing.
