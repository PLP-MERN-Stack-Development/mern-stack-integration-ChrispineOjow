# MERN Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js. This application demonstrates seamless integration between front-end and back-end components, including database operations, API communication, and state management.

## Features

- ✅ User Authentication (Registration, Login, Protected Routes)
- ✅ Blog Post CRUD Operations
- ✅ Category Management
- ✅ Image Upload for Featured Images
- ✅ Pagination for Post List
- ✅ Search and Filter Functionality
- ✅ Comments System
- ✅ Responsive Design

## Project Structure

```
mern-stack-integration-ChrispineOjow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # Context API for state management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── App.jsx        # Main App component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Uploaded images
│   ├── server.js          # Server entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd mern-stack-integration-ChrispineOjow
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Environment Setup

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

#### Client Environment Variables (Optional)

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### Start the Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

### Start the Client

Open a new terminal:

```bash
cd client
npm run dev
```

The client will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination, search, filter)
- `GET /api/posts/search?q=query` - Search posts
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a new post (Protected)
- `PUT /api/posts/:id` - Update a post (Protected)
- `DELETE /api/posts/:id` - Delete a post (Protected)
- `POST /api/posts/:id/comments` - Add a comment (Protected)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category (Protected, Admin only)

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Vite** - Build tool
- **Axios** - HTTP client
- **Context API** - State management

## Key Features Implementation

### 1. Authentication
- JWT-based authentication
- Protected routes
- User registration and login
- Role-based access control (Admin/User)

### 2. Blog Posts
- Create, Read, Update, Delete operations
- Featured image uploads
- Rich text content
- Tags and categories
- Publishing status

### 3. Search & Filter
- Full-text search across title, content, and excerpt
- Category filtering
- Pagination support

### 4. Comments
- Add comments to posts
- View all comments
- User association with comments

### 5. State Management
- Context API for global state
- Custom hooks for API calls
- Optimistic UI updates

## Development

### Server Development

```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Client Development

```bash
cd client
npm run dev  # Vite dev server with hot reload
```

## Building for Production

### Build Client

```bash
cd client
npm run build
```

The build output will be in the `client/dist` directory.

### Production Server

For production, you may want to:
1. Serve the built React app from Express
2. Use environment variables for production settings
3. Set up proper error logging
4. Configure CORS appropriately

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env` file
- Verify MongoDB connection string format

### Port Already in Use
- Change the PORT in server `.env` file
- Update client proxy configuration if needed

### Image Upload Issues
- Ensure `server/uploads` directory exists
- Check file size limits (currently 5MB)
- Verify multer configuration

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!
