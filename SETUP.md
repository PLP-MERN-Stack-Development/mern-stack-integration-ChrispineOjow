# Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB running locally or MongoDB Atlas account

## Step-by-Step Setup

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

**Frontend (`client/.env` - Optional):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
mongod
```

**Or use MongoDB Atlas:**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URI` in `.env`

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. **Register a new user** at http://localhost:3000/register
2. **Create a category** (requires admin role - you can manually set role in MongoDB)
3. **Create your first post** at http://localhost:3000/posts/create

## Creating an Admin User

To create an admin user, you can either:

1. **Manually in MongoDB:**
   ```javascript
   use mern-blog
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Or modify the User model** to set default role as admin for testing

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, ensure IP whitelist includes your IP

### Port Already in Use
- Change PORT in `server/.env`
- Update proxy in `client/vite.config.js` if needed

### Image Upload Not Working
- Ensure `server/uploads` directory exists (created automatically)
- Check file size (max 5MB)
- Verify multer configuration

### CORS Errors
- Ensure backend CORS is configured
- Check API URL in frontend `.env`

## Testing the API

You can test the API using:

**Postman/Insomnia:**
- Base URL: `http://localhost:5000/api`
- Add `Authorization: Bearer <token>` header for protected routes

**cURL:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment variables for sensitive data
5. Build frontend: `cd client && npm run build`
6. Serve static files from Express or use a CDN

