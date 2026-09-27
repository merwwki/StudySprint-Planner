# Reflection Journal

## Week of: September 30, 2026

## My goal this week

My goal this week is to continue improving the StudySprint Planner and begin moving from the frontend prototype toward a full-stack application. After getting the basic frontend working during Week 1, I wanted to better understand how the React frontend would communicate with an Express backend and eventually connect to a PostgreSQL database.
## What I did

- I continued improving the StudySprint Planner interface and tested the existing task-management features to make sure they were working properly.
- I refined the task creation form and task list so that important information such as the task title, subject, description, due date, priority, and completion status could be handled properly.
- I continued testing the localStorage functionality and checked that tasks remained available after refreshing the application.
- I reviewed the frontend project structure and the different files involved in handling the interface, API functions, sample data, and styling.
- I started working on the Express backend and began organizing the backend structure for the project.
- I reviewed how the backend API would eventually communicate with the React frontend and how the task data would be handled through API requests.
- I also started preparing for the PostgreSQL database by reviewing the information that needs to be stored for each study task.
- I continued updating the project documentation based on the progress and changes made during this week.

## What blocked me

My main difficulty this week was understanding how the frontend, backend, and database were supposed to work together. I was already more comfortable with the React frontend because I had worked on it during Week 1, but the Express backend was a new part of the project for me. I also had difficulty understanding how the task data in the frontend should correspond to the database structure. I had to think about which fields needed to be stored and how the backend would receive and return those values. Another challenge was figuring out which parts of the existing mock API needed to be replaced once the real backend was introduced. The project instructions were also still a little overwhelming because there are several requirements that need to be completed separately. I sometimes had to go back to the instructions and check whether I was working on the correct part of the project.

## What I learned

This week, I learned more about how a full-stack application is divided into different parts. I now have a better understanding that the React/Vite frontend is responsible for the user interface, while the Express backend handles requests and communicates with the database. I also learned that moving from a mock API to a real backend requires more than just changing one file. The frontend, API routes, database structure, and environment variables all need to work together correctly. I also became more comfortable navigating the project structure and understanding where different parts of the application belong. Compared with Week 1, I feel less confused about the overall organization of the project, although I still need to learn more about backend development and PostgreSQL. Overall, Week 2 helped me understand that building the project is not only about making the interface look and work properly. The backend and database are important because they will allow the application to store and manage data properly instead of relying only on browser storage.
