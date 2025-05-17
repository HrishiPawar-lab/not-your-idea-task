# Task Management System - README

This project is a **Task Management System** built with a modern tech stack including:

* **Frontend**: React.js (with TailwindCSS)
* **Backend**: Node.js, Express
* **Database**: MongoDB
* **WebSocket**: Real-time updates using Socket.IO

It supports role-based access for users and admins, activity logging, and task categorization by status.

---

## 🚀 Features

* ✅ User authentication with JWT
* ✅ Role-based access (Admin and User)
* ✅ Real-time task creation and updates via WebSockets
* ✅ Activity logging with audit trails
* ✅ Responsive UI with Kanban-style columns
* ✅ Paginated audit log view
* ✅ 404 and Settings pages with SVG illustrations

---

## 🧑 Demo Users

| Role  | Username   | Password   |
| ----- | ---------- | ---------- |
| Admin | superadmin | superadmin |
| User  | John Doe   | John Doe   |

---

## 🔧 Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/task-management-app.git
cd task-management-app
```

### 2. **Backend Setup**

```bash
cd server
npm install

# Create a .env file with:
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskapp
JWT_SECRET=your_jwt_secret

npm run dev
```

### 3. **Frontend Setup**

```bash
cd client
npm install

# Create a .env file with:
VITE_API_URL=http://localhost:5000/api/v1

npm run dev
```

---

## 🧠 Project Structure

### Backend:

* **/schemas**: Mongoose models (User, Task, AuditLog)
* **/controllers**: Express route handlers (auth, task, audit)
* **/routes**: Modular API routing
* **/utils**: Helper classes (like `ApiResponse`)
* **/middleware**: Auth & role-based access control

### Frontend:

* **/components**: Reusable components (Header, TaskCard, etc.)
* **/pages**: App views (Dashboard, Login, Settings, NotFound)
* **/services**: HTTP client abstraction using Axios
* **/utils**: Socket instance and helpers

---

## ⚙️ WebSocket Behavior

* Listens to `task-created` and `task-updated` events
* Updates Kanban columns in real-time
* Deduplicates tasks using `_id` check

Example handler:

```js
socket.on("task-updated", (updatedTask) => {
  setTasksByStatus(prev => {
    const updated = { ...prev };

    // Remove old task from all columns
    for (const status in updated) {
      updated[status] = updated[status].filter(task => task._id !== updatedTask._id);
    }

    // Ensure the status column exists before pushing
    if (updated[updatedTask.status]) {
      updated[updatedTask.status].push(updatedTask);
    }

    return updated;
  });
});
```

---

## 📜 Audit Logging

All task actions (create/update) are recorded in the `auditlog` collection.
Admins can view logs for **all users** from the `/logs` route.

```js
const history = await AuditLog.find()
  .sort({ timestamp: -1 })
  .populate("user", "email")
  .populate("task", "title");
```

---

## 🧪 Testing Users

You can create users with hashed passwords using the following script:

```js
const bcrypt = require("bcrypt");
const hash = await bcrypt.hash("superadmin", 10);
```

Use the hash value in MongoDB for `passwordHash`.

---

## 📄 Additional Pages

* `/settings`: Work-in-progress illustration with SVG
* `*`: 404 Not Found page with centered design and redirect to Home

---

## 🛠️ Troubleshooting

* Make sure MongoDB is running locally
* Use the correct `.env` files in both client and server
* If WebSocket duplicates tasks, ensure `_id` uniqueness is checked

---

## 📬 Contact

For questions, please reach out via GitHub issues or email.
