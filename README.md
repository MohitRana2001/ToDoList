# Todo List

### This is a full-stack Todo List application that allows users to create, manage, and filter tasks. The backend is powered by Catalyst Serverless Functions, while the frontend is built using React.

## Table of Contents

1. Features
2. Technologies Used
3. Installation
4. Backend API
5. Frontend Setup
6. Usage
7. Deployment
8. Error Handling


### Features

- Create new tasks with titles and descriptions
- Mark tasks as completed or pending
- Edit and update existing tasks
- Filter tasks (all, completed, pending)
- Search tasks by title
- Responsive UI built using React
- Error boundaries for error handling

## Technologies Used

### Backend:

- Catalyst Serverless Functions
- Axios for making HTTP requests
### Frontend:

- React for UI
- TypeScript for static typing
- Axios for API requests
- CSS for styling

## Installation

Follow the steps below to set up the project locally.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- catalyst CLI

### Backend Setup

1. Clone the repository.

`
git clone https://github.com/your-username/todo-list-app.git
cd todo-list-app
`

2. Navigate to the server directory and follow the sereverless setup instructions for catalyst.

`
catalyst functions:setup
catalyst serve
`

### Frontend Setup

1. Install dependencies for the frontend

`
catalyst client:setup
cd client
npm install
`

2. Update the API_BASE_URL int the App.tsx

`
const API_BASE_URL = "https://your-catalyst-url.com/server/todo_list_function";
`

3. Start the frontend Application

`
npm start
`

## Backend API

### Base URL:

`
https://todolist-60033657749.development.catalystserverless.in/server/todo_list_function
`

### Endpoints

1. GET /tasks : Fetch all tasks

2. POST /tasks : Add a new task

3. PUT /tasks/:id : Update an existing task by ID.

4. DELETE /tasks/:id : Delete task by ID.


## Frontend Setup

### Components

- TaskList: Displays a list of tasks based on filters and search results.
- TaskForm: Form to add or edit tasks.
- SearchBar: Allows users to search for tasks by title.
- FilterButtons: Buttons to filter tasks by their status (all, completed, pending).


### Usage

1. Adding a Task: Use the form to enter the task title and description, and submit to add it to the list.

2. Editing a Task: Click the edit icon next to any task, update the fields, and save the changes.

3. Deleting a Task: Click the delete button to remove a task from the list.

4. Filtering Tasks: Use the filter buttons to view all tasks, only completed tasks, or only pending tasks.

5. Searching Tasks: Use the search bar to find tasks based on their title.

### Deployment

To deploy your frontend:

1. Build the frontend

`
npm run build
`

2. Deploy the client

`
catalyst deploy
`

## Error Handling

The application uses React's built-in error boundaries to gracefully handle unexpected errors and avoid crashing the UI. If an API call fails or there's an issue with the frontend, a console message will log the error and notify the user.

Error examples include:

- 500 Internal Server Error: When the backend is unavailable.
- 404 Not Found: If a task is not found.








