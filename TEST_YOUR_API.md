# 🧪 Test Your Deployed API

## ✅ Your URLs to Test:

### 1. Root Endpoint
```
https://task20-one.vercel.app/
```
**Expected:** Welcome message with API info

### 2. Health Check
```
https://task20-one.vercel.app/health
```
**Expected:** `{"status": "Server is running", "timestamp": "..."}`

### 3. Swagger Documentation
```
https://task20-one.vercel.app/api-docs
```
**Expected:** Interactive Swagger UI with all endpoints

### 4. Get All Tasks
```
https://task20-one.vercel.app/api/v1/tasks
```
**Expected:** `{"success": true, "data": []}` (empty array if no tasks)

## 📝 How to Test POST Endpoints (Create Tasks)

### Option 1: Using Swagger UI (Easiest)

1. **Go to Swagger:**
   ```
   https://task20-one.vercel.app/api-docs
   ```

2. **Find "POST /api/v1/tasks"** section

3. **Click "Try it out"**

4. **Enter task data:**
   ```json
   {
     "title": "Complete project documentation",
     "description": "Finish API documentation",
     "status": "pending"
   }
   ```

5. **Click "Execute"**

6. **See the response** - Should show created task with `_id`

### Option 2: Using Postman

1. **Method:** POST
2. **URL:** `https://task20-one.vercel.app/api/v1/tasks`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (raw JSON):**
   ```json
   {
     "title": "Test Task",
     "description": "This is a test task",
     "status": "pending"
   }
   ```
5. **Send** - Should return 201 with created task

### Option 3: Using curl (Command Line)

```bash
curl -X POST https://task20-one.vercel.app/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing the API",
    "status": "pending"
  }'
```

## 🧪 Complete Testing Checklist

### Test All Endpoints:

1. **✅ GET /** - Root endpoint
2. **✅ GET /health** - Health check
3. **✅ GET /api-docs** - Swagger UI
4. **✅ GET /api/v1/tasks** - Get all tasks (should be empty initially)
5. **✅ POST /api/v1/tasks** - Create a task
6. **✅ GET /api/v1/tasks/:id** - Get single task (use ID from step 5)
7. **✅ PUT /api/v1/tasks/:id** - Update task
8. **✅ PATCH /api/v1/tasks/:id** - Partial update
9. **✅ DELETE /api/v1/tasks/:id** - Delete task
10. **✅ GET /api/v1/tasks/search/title?q=test** - Search tasks
11. **✅ GET /api/v1/tasks/status/pending** - Filter by status

## 📋 Example POST Request Body

### Create Task (Minimum Required):
```json
{
  "title": "My First Task"
}
```

### Create Task (Full):
```json
{
  "title": "Complete project",
  "description": "Finish API documentation",
  "status": "pending",
  "dueDate": "2024-12-31T23:59:59Z"
}
```

### Valid Status Values:
- `"pending"`
- `"in-progress"`
- `"completed"`

## ✅ Expected Responses

### Successful POST (201):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project",
    "description": "Finish API documentation",
    "status": "pending",
    "completed": false,
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  }
}
```

### Error Response (400):
```json
{
  "success": false,
  "error": "Validation error",
  "message": "title is required"
}
```

## 🎯 Quick Test Flow

1. **Open Swagger:** https://task20-one.vercel.app/api-docs
2. **Create a task** using POST endpoint
3. **Get all tasks** using GET endpoint (should show your created task)
4. **Update the task** using PUT/PATCH
5. **Delete the task** using DELETE

## ✅ Confirmation Checklist

- [ ] Root endpoint works
- [ ] Health check works
- [ ] Swagger UI loads
- [ ] Can create task (POST)
- [ ] Can get tasks (GET)
- [ ] Can update task (PUT/PATCH)
- [ ] Can delete task (DELETE)
- [ ] Search works
- [ ] Filter by status works

All working? **You're ready for defense!** 🎉

