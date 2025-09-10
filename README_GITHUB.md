# 🎉 IIT Dharwad Fresher Party Voting System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)

*A comprehensive backend system for managing fresher party voting, song suggestions, and anonymous messaging at IIT Dharwad*

</div>

## 📖 About

This is the backend API for the IIT Dharwad Fresher Party 2025 voting system. It provides secure authentication, real-time voting, song suggestions, and anonymous messaging features for the college fresher party event.

## ✨ Features

- 🗳️ **Secure Voting System** - Vote for Mr./Miss Fresher with fraud prevention
- 🎵 **Song Suggestions** - Submit and manage party playlist suggestions
- 💬 **Anonymous Messaging** - Send anonymous messages to the community
- 🔐 **JWT Authentication** - Secure login with email OTP verification
- ⚡ **Real-time Updates** - Live vote counting with Socket.IO
- 👨‍💼 **Admin Panel** - Comprehensive admin controls and analytics
- 🛡️ **Security Features** - Rate limiting, email validation, and spam protection

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt, Nodemailer
- **Real-time**: Socket.IO
- **Security**: CORS, Rate limiting, Input validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- Gmail App Password


## 📡 API Endpoints

### Authentication
- `POST /api/v1/fresherParty/signup` - User registration
- `POST /api/v1/fresherParty/verifyOTP` - Email verification
- `POST /api/v1/fresherParty/login` - User login

### Voting
- `POST /api/v1/fresherParty/vote` - Cast vote
- `GET /api/v1/fresherParty/vote/category/:category` - Get candidates

### Song Suggestions
- `POST /api/v1/fresherParty/songs/submit` - Submit songs
- `GET /api/v1/fresherParty/songs/my-suggestions` - View submissions

### Anonymous Messages
- `POST /api/v1/fresherParty/messages/send` - Send message
- `GET /api/v1/fresherParty/messages/my-messages` - View messages

### Admin (Admin Only)
- `POST /admin` - Create candidate
- `PATCH /admin/verify-all-users` - Verify all users
- `DELETE /admin/cleanup-otp-users` - Cleanup unverified users

## 📁 Project Structure

```
fresher-voting/
├── controllers/          # Route handlers
├── models/              # Database schemas
├── routers/             # Route definitions
├── utils/               # Utility functions
├── middleware/          # Custom middleware
├── test/                # Test files
├── app.js              # Express app setup
├── server.js           # Server startup
├── config.js           # Database connection
└── config.env          # Environment variables
```

## 🔒 Security Features

- **Email Validation**: Only IIT Dharwad students (batches 2024 & 2025)
- **Rate Limiting**: Prevents spam and abuse
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Controlled cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for IIT Dharwad Fresher Party 2025. All rights reserved.

## 👨‍💻 Developer

**Ayush Raj**  
📧 ayushraj1392004@gmail.com  
🐙 [@Ayushx13](https://github.com/Ayushx13)

---

<div align="center">

**Made with ❤️ for IIT Dharwad Fresher Party 2025**

⭐ Star this repo if you found it helpful!

</div>
