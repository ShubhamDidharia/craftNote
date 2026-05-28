# CraftNote Backend Authentication API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file (or copy from `.env.example`) with:
```
MONGODB_URI=mongodb://localhost:27017/craftnote
JWT_SECRET=your_secure_secret_key_here
PORT=5000
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a strong random string in production.

### 3. Start MongoDB
Ensure MongoDB is running locally or update `MONGODB_URI` to your MongoDB connection string.

### 4. Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

---

## API Endpoints

### Authentication Routes

#### 1. **POST /api/auth/signup** - Register a New User
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

**Validation Errors:**
- 400: Missing required fields
- 400: Passwords do not match
- 400: Password less than 6 characters
- 409: Email already registered

---

#### 2. **POST /api/auth/signin** - Login User
**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Email and password required
- 401: Invalid email or password

---

#### 3. **GET /api/auth/me** - Get Current User (Protected)
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: No token provided
- 401: Invalid or expired token

---

## Using Auth Middleware

To protect routes, use the `authMiddleware`:

```javascript
const authMiddleware = require('./middleware/authMiddleware');

// Protected route example
router.get('/protected-route', authMiddleware, (req, res) => {
  // req.user contains: { id: userId, iat: timestamp, exp: timestamp }
  console.log('User ID:', req.user.id);
  res.json({ message: 'This is a protected route' });
});
```

---

## File Structure

```
backend/
├── index.js                    # Main server file
├── package.json               # Dependencies
├── .env                       # Environment variables (not in git)
├── .env.example              # Example env file
├── models/
│   └── User.js               # User schema with password hashing
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
└── routes/
    └── auth.js               # Auth endpoints (signup, signin, me)
```

---

## Security Features

✅ **Password Hashing**: Uses bcrypt with salt rounds (10) for secure password storage
✅ **JWT Tokens**: Signed with secret key, expires in 7 days
✅ **Password Not Returned**: User password excluded from all API responses
✅ **Input Validation**: Email format, password requirements checked
✅ **Token Verification**: Bearer token extracted and verified on protected routes
✅ **CORS Support**: Cross-origin requests enabled
✅ **Error Handling**: Centralized error middleware

---

## Testing with Postman/cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### Signin
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Next Steps

1. Add additional routes and protect them with `authMiddleware`
2. Implement password reset functionality
3. Add email verification on signup
4. Connect frontend to these endpoints
5. Change `JWT_SECRET` to a strong value in production
6. Configure MongoDB with proper authentication in production
