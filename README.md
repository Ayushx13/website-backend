# 🎉 IIT Dharwad Fresher Party Voting System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)

*A comprehensive backend system for managing fresher party voting, song suggestions, and anonymous messaging*

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [API Documentation](#-api-documentation)
- [Admin Features](#-admin-features)
- [Real-time Features](#-real-time-features)
- [Security Features](#-security-features)
- [Contributing](#-contributing)

## ✨ Features

### 🗳️ **Voting System**
- Secure candidate voting for Mr./Miss Fresher
- One vote per category per user
- Real-time vote counting with Socket.IO
- Vote validation and fraud prevention

### 🎵 **Song Suggestions**
- Submit up to 3 Spotify song links
- View all song suggestions (admin only)
- User-specific suggestion tracking

### 💬 **Anonymous Messaging**
- Send anonymous messages (max 100 words)

### 🔐 **Authentication & Security**
- JWT-based authentication
- Email OTP verification
- College email validation (1st year and 2nd year IIT Dharwad students only)
- Role-based access control
- Rate limiting and spam protection

### 👨‍💼 **Admin Panel**
- User management and verification
- Candidate management
- Bulk operations (verify all users, cleanup)
- System monitoring and analytics

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt
- **Email Service**: Nodemailer with Gmail
- **Real-time**: Socket.IO
- **Validation**: Custom validation middleware
- **Security**: Helmet, CORS, Rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail App Password for email service

---

## 🔑 Authentication Endpoints

### 1. Sign Up
```http
POST /signup
```

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "cs25bt001@iitdh.ac.in",
    "password": "securePassword123"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Signup successful. OTP sent to email for verification."
}
```

**Email Validation Rules:**
- Format: `{branch}{year}{course}{roll}@iitdh.ac.in`
- Branches: `cs, ee, ec, mc, me, ce, ep, is, ch`
- Years: `24, 25` (2024, 2025 batches)
- Course: `bt` (B.Tech) or `bm` (only for IS branch)
- Roll: `001-070`

### 2. Verify OTP
```http
POST /verifyOTP
```

**Request Body:**
```json
{
    "email": "cs25bt001@iitdh.ac.in",
    "otp": "123456"
}
```

**Response:**
```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
        "user": {
            "name": "John Doe",
            "email": "cs25bt001@iitdh.ac.in",
            "role": "student",
            "isVerified": true
        }
    }
}
```

### 3. Login
```http
POST /login
```

**Request Body:**
```json
{
    "email": "cs25bt001@iitdh.ac.in",
    "password": "securePassword123"
}
```

---

## 🗳️ Voting Endpoints

### 1. Cast Vote
```http
POST /vote
```

**Request Body:**
```json
{
    "candidateID": "candidate_object_id"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Vote registered successfully ✅",
    "candidate": {
        "id": "candidate_object_id",
        "name": "Candidate Name",
        "category": "Mr_Fresher",
        "votes": 42
    }
}
```

### 2. Get Candidates by Category
```http
GET /vote/category/:category
```

**Parameters:**
- `category`: `Mr_Fresher` or `Miss_Fresher`

**Response:**
```json
{
    "status": "success",
    "results": 5,
    "data": {
        "candidates": [
            {
                "name": "Candidate Name",
                "category": "Mr_Fresher",
                "vote": 42
            }
        ]
    }
}
```

---

## 🎵 Song Suggestion Endpoints

### 1. Submit Song Suggestions
```http
POST /songs/submit
```

**Request Body:**
```json
{
    "songLinks": [
        "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
        "https://open.spotify.com/track/1301WleyT98MSxVHPZCA6M",
        "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5"
    ]
}
```

**Validation:**
- Maximum 3 songs per user
- Must be valid Spotify URLs
- One submission per user

### 2. View My Song Suggestions
```http
GET /songs/my-suggestions
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "suggestions": {
            "songLinks": ["..."],
            "submittedAt": "2025-01-15T10:30:00.000Z"
        }
    }
}
```

---

## 💬 Anonymous Messaging Endpoints

### 1. Send Anonymous Message
```http
POST /messages/send
```

**Request Body:**
```json
{
    "message": "Looking forward to the fresher party! 🎉"
}
```

**Validation:**
- Maximum 100 words
- No inappropriate content

### 2. View My Messages
```http
GET /messages/my-messages
```

**Response:**
```json
{
    "status": "success",
    "results": 3,
    "data": {
        "messages": [
            {
                "message": "Looking forward to the fresher party! 🎉",
                "sentAt": "2025-01-15T10:30:00.000Z"
            }
        ]
    }
}
```

---

## 👨‍💼 Admin Features

### Authentication Required
All admin endpoints require admin role (`role: 'admin'`).

### 1. Verify All Users at Once
```http
PATCH /admin/verify-all-users
```

**Response:**
```json
{
    "status": "success",
    "message": "5 users verified successfully",
    "data": {
        "modifiedCount": 5,
        "totalVerifiedUsers": 15,
        "previousUnverifiedCount": 5
    }
}
```

### 2. Cleanup OTP Users
```http
DELETE /admin/cleanup-otp-users
```

**Response:**
```json
{
    "status": "success",
    "message": "Users with OTP removed: 3"
}
```

### 3. Create Candidate
```http
POST /admin
```

**Request Body:**
```json
{
    "name": "Candidate Name",
    "category": "Mr_Fresher"
}
```

### 4. Update Candidate
```http
PATCH /admin/:id
```

### 5. Delete Candidate
```http
DELETE /admin/:id
```

### 6. Get All Messages (Admin Only)
```http
GET /messages/all
```

**Response:**
```json
{
    "status": "success",
    "results": 10,
    "data": {
        "messages": [
            {
                "message": "Message content",
                "user": {
                    "name": "Student Name",
                    "email": "student@iitdh.ac.in"
                },
                "sentAt": "2025-01-15T10:30:00.000Z"
            }
        ]
    }
}
```

### 7. Get All Song Suggestions (Admin Only)
```http
GET /songs/all
```

---

## ⚡ Real-time Features

### Socket.IO Integration

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Listen for real-time vote updates
socket.on('voteUpdate', (data) => {
    console.log('New vote received:', data);
    // data: { candidateId, category, newVoteCount, candidateName }
});

// Get initial vote counts when connecting
socket.on('initialVoteCounts', (candidates) => {
    console.log('Current vote standings:', candidates);
});

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to vote tracking');
});

socket.on('disconnect', () => {
    console.log('Disconnected from vote tracking');
});
```

---

## 🔒 Security Features

### Email Validation
- **College Email Only**: Only `@iitdh.ac.in` emails accepted
- **Batch Restriction**: Only 2024 & 2025 batches
- **Branch Validation**: Valid branch codes with proper course mapping
- **Blocked Emails**: Specific email addresses can be blocked

### Rate Limiting
- **General API**: 100 requests per IP per 15 minutes
- **Email Sending**: Optimized with connection pooling
- **Vote Limits**: One vote per category per user
- **Song Limits**: One submission per user (max 3 songs)

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **OTP Verification**: 6-digit OTP with 5-minute expiry
- **Role-based Access**: Student/Admin role separation

---

## 🛡️ Error Handling

### Standard Error Response
```json
{
    "status": "error",
    "message": "Descriptive error message"
}
```

### Common Error Codes
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (no/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate entry)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

---

## 📁 Project Structure

```
fresher-voting/
├── controllers/           # Route handlers
│   ├── authController.js     # Authentication logic
│   ├── voteController.js     # Voting logic
│   ├── songController.js     # Song suggestions
│   ├── messageController.js  # Anonymous messaging
│   └── globalError.js       # Error handling
├── models/               # Database schemas
│   ├── userModel.js         # User schema
│   ├── candidateModel.js    # Candidate schema
│   ├── voteModel.js         # Vote tracking
│   ├── songSuggestion.js    # Song suggestions
│   └── anonymousMessage.js  # Messages
├── routers/              # Route definitions
│   ├── authRouter.js        # Auth routes
│   ├── voteRouter.js        # Voting routes
│   ├── songRouter.js        # Song routes
│   ├── messageRouter.js     # Message routes
│   └── adminRouter.js       # Admin routes
├── utils/                # Utility functions
│   ├── email.js            # Email service
│   ├── emailTemplate.js    # HTML email templates
│   ├── appError.js         # Error handling
│   └── catchAsync.js       # Async error wrapper
├── middleware/           # Custom middleware
├── test/                 # Test files
├── app.js               # Express app setup
├── server.js            # Server startup
├── config.js            # Database connection
├── config.env           # Environment variables
└── README.md            # This file
```

---
---

## 📝 License

This project is created for IIT Dharwad Fresher Party 2025. All rights reserved.

---

## 👥 Contact

**Developer**: Ayush Raj  
**Email**: ayushraj1392004@gmail.com  
**GitHub**: [@Ayushx13](https://github.com/Ayushx13)

---

<div align="center">

**Made with ❤️ for IIT Dharwad Fresher Party 2025**

*Happy Voting! 🎉*

</div>
