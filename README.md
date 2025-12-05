# Task Management API

A RESTful API for managing tasks (To-Do List) built with Express.js, Mongoose, and MongoDB.

## 🚀 Features

- ✅ Full CRUD operations for tasks
- ✅ Search tasks by title
- ✅ Filter tasks by status
- ✅ Assign tasks to users
- ✅ Update task progress/status
- ✅ Input validation and error handling
- ✅ Swagger API documentation
- ✅ Secure with Helmet and CORS
- ✅ MongoDB integration with Mongoose

## 📋 API Endpoints

### Task Endpoints

1. **GET /api/v1/tasks** - Get all tasks
2. **POST /api/v1/tasks** - Create a new task
3. **GET /api/v1/tasks/:id** - Get a task by ID
4. **PUT /api/v1/tasks/:id** - Update a task completely
5. **PATCH /api/v1/tasks/:id** - Partially update a task
6. **DELETE /api/v1/tasks/:id** - Delete a task
7. **GET /api/v1/tasks/search/title?q=query** - Search tasks by title
8. **GET /api/v1/tasks/status/:status** - Filter tasks by status
9. **PUT /api/v1/tasks/:id/complete** - Mark a task as completed
10. **PUT /api/v1/tasks/:id/progress** - Update task progress/status
11. **POST /api/v1/tasks/:id/assign** - Assign a task to a user

### User Endpoints

1. **GET /api/v1/users/:userId/tasks** - Get all tasks assigned to a user

### Health Check

- **GET /health** - Check server status

### Documentation

- **GET /api-docs** - Swagger API documentation

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/andrealexisdelossantos/task.git
cd task
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
CORS_ORIGIN=*
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

## 📚 API Documentation

Access Swagger documentation at:
- Local: `http://localhost:3000/api-docs`
- Production: `https://your-vercel-url.vercel.app/api-docs`

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing
- **Input Validation**: All inputs validated
- **Error Handling**: Graceful error handling
- **Environment Variables**: Sensitive data in .env

## 🚢 Deployment

Deployed on Vercel. See deployment instructions in the repository.

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Error message"
}
```

## 🎯 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 👨‍💻 Author

Andrea Alexis Delos Santos

## 📄 License

ISC

