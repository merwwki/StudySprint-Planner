# Reflection Journal

## Week of: September 23, 2026

## My goal this week

My goal this week is to start developing the StudySprint Planner by setting up the project repository and building the initial frontend. I wanted to transform the provided starter template into an academic task planner and get the main task-management features working before starting the backend.

## What I did

- I created the GitHub repository for the StudySprint Planner and updated the LICENSE and README.md. I then set up and ran the React/Vite frontend locally.
- I modified the starter template so that it worked as a study task planner instead of the original sightings application. I replaced the sample data with academic tasks containing titles, subjects, descriptions, due dates, and priorities. I also updated the mock API to work with study tasks and use localStorage to save the data in the browser.
- I built the main StudySprint Planner interface, including a form for adding tasks and a list for displaying them. I added functionality to create and delete tasks and made sure tasks remained saved after refreshing the page. I also updated the CSS to give the application a cleaner academic planner design.
- I configured the project for GitHub Pages and pushed my project changes to GitHub. I also created and pushed the weekly increment report required for the project.

## What blocked me

One of my main difficulties was understanding the project structure because there were several folders and instructions, including the public project repository and the private course workspace. I was initially unsure about where files such as REPORT.md and other documentation were supposed to be placed. I also encountered a blank white page after changing the starter application. I eventually found that api/index.js was still importing and exporting the old sighting-related functions, which did not match the new task-based API. After updating it to use the task API, the application worked again. The main difficulty I have now is just understanding where files are supposed to be placed, because there were so many instructions that are very long. I had to clarify with an AI assistant which belongs to which, but the AI also struggled.

## What I learned

I learned how the different parts of a React/Vite project connect to each other. In particular, I now understand better how App.jsx, the API files, seed.json, and styles.css work together. I also learned the difference between the frontend and backend parts of the project. At this stage, the application is using a mock API and browser localStorage, so it can demonstrate the basic task-management features without a database or server. I now understand that the later backend will replace this mock setup with an actual API and database. I also learned that when changing a starter template, it is important to check all related files and references instead of only changing the main interface. The blank page helped me understand how an outdated API import can prevent the entire React application from loading. Finally, although not completely, but I learned more about using GitHub to store and update my project and how to organize project files separately from course documentation.
