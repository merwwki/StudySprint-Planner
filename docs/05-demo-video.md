# StudySprint Planner — Demo Video
DEMO VIDEO: https://drive.google.com/file/d/1qAYQeVaabI9UZiDAAm8CbiiAuQ7rZUN_/view?usp=share_link 

## Introduction

StudySprint Planner is a web-based academic task planner designed to help students organize assignments, manage deadlines, and track completed work.

The application provides a centralized interface for managing academic tasks through a frontend connected to a backend API and PostgreSQL database.

## Application Demonstration

The demonstration begins with the deployed StudySprint Planner website and its configured login mechanism.

After logging in, the task dashboard displays saved academic tasks and their available details, including titles, subjects, due dates, priorities, and completion status.

The demonstration then shows the main task-management workflow.

### Creating a Task

A new academic task is entered through the task form. The task details include its title, subject, description, due date, and priority. After submission, the new task appears in the dashboard.

### Editing a Task

An existing task is selected for editing. One or more details are updated, and the changes are saved. The dashboard then displays the updated information.

### Tracking Completion

A task is marked as completed to demonstrate the application's completion-tracking functionality. This allows users to distinguish finished work from tasks that still need attention.

### Deleting a Task

A prepared demonstration task is deleted. The task is removed from the dashboard after the operation succeeds.

## Technical Overview

StudySprint Planner uses React and Vite for the frontend, Node.js and Express for the backend API, and PostgreSQL for persistent data storage.

The frontend communicates with the backend API to perform task operations. The backend processes requests and interacts with the database to retrieve and update task records.

The frontend is deployed on GitHub Pages, the backend API is hosted on Render, and the database is hosted on Neon.

Separating the frontend, backend, and database organizes the application into distinct components with different responsibilities.

## Reflection

Developing StudySprint Planner provided practical experience in building and deploying a full-stack web application. Connecting the frontend, backend API, and database required attention to request handling, data persistence, configuration, and testing.

Future improvements could include additional automated tests, improved task organization, calendar integration, and deadline notifications. These enhancements would build on the current task-management functionality.

## Demonstration Scope

The video demonstrates the actual deployed application and its working features. It presents the main workflow of logging in, viewing tasks, creating a task, editing a task, tracking completion, and deleting a task.

The technical explanation focuses on the application's architecture and the responsibilities of its frontend, backend, and database.

The demonstration is intended to provide a concise overview of the application's functionality, technical implementation, and development experience.