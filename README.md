# Fresher Party Voting System - API Documentation

## Base URL
```
http://your-api-domain/api/v1/fresherParty
```

## Authentication
All requests (except signup and login) require JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token
```

## Authentication Endpoints

### 1. Sign Up
```javascript
POST /signup

Request Body:
{
    "name": "Student Name",
    "email": "student@iitdh.ac.in",
    "password": "yourpassword"
}

Response:
{
    "status": "success",
    "message": "Signup successful. OTP sent to email for verification."
}
```

### 2. Verify OTP
```javascript
POST /verifyOTP

Request Body:
{
    "email": "student@iitdh.ac.in",
    "otp": "123456"
}

Response:
{
    "status": "success",
    "token": "jwt_token",
    "data": {
        "user": {
            "name": "Student Name",
            "email": "student@iitdh.ac.in",
            "role": "student",
            "isVerified": true
        }
    }
}
```

### 3. Login
```javascript
POST /login

Request Body:
{
    "email": "student@iitdh.ac.in",
    "password": "yourpassword"
}

Response:
{
    "status": "success",
    "token": "jwt_token",
    "data": {
        "user": {
            "name": "Student Name",
            "email": "student@iitdh.ac.in",
            "role": "student",
            "isVerified": true
        }
    }
}
```

## Voting Endpoints

### 1. Cast Vote
```javascript
POST /vote

Request Body:
{
    "candidateID": "candidate_id"
}

Response:
{
    "status": "success",
    "message": "Vote registered successfully ✅",
    "candidate": {
        "id": "candidate_id",
        "name": "Candidate Name",
        "category": "Mr_Fresher",
        "votes": 42
    }
}
```

### 2. Get Candidates by Category (Protected)
```javascript
GET /vote/category/:category
// category can be 'Mr_Fresher' or 'Miss_Fresher'

Response:
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
            // ... more candidates
        ]
    }
}
```

## Song Suggestion Endpoints

### 1. Submit Song Suggestions
```javascript
POST /songs/submit

Request Body:
{
    "songLinks": [
        "https://open.spotify.com/track/songId1",
        "https://open.spotify.com/track/songId2",
        "https://open.spotify.com/track/songId3"
    ]
}

Response:
{
    "status": "success",
    "data": {
        "songSuggestion": {
            "songLinks": ["..."],
            "user": "user_id"
        }
    }
}
```

### 2. View My Song Suggestions
```javascript
GET /songs/my-suggestions

Response:
{
    "status": "success",
    "data": {
        "suggestions": {
            "songLinks": ["..."]
        }
    }
}
```

## Anonymous Messages

### 1. Send Anonymous Message
```javascript
POST /messages/send

Request Body:
{
    "message": "Your message here (max 100 words)"
}

Response:
{
    "status": "success",
    "data": {
        "message": "Your message here"
    }
}
```

### 2. View My Messages
```javascript
GET /messages/my-messages

Response:
{
    "status": "success",
    "results": 2,
    "data": {
        "messages": [
            {
                "message": "Message content"
            }
            // ... more messages
        ]
    }
}
```

## Admin Only Endpoints

### 1. Get All Candidates
```javascript
GET /admin/all

Response:
{
    "status": "success",
    "results": 10,
    "data": {
        "candidates": [
            {
                "name": "Candidate Name",
                "category": "Mr_Fresher",
                "vote": 42
            }
            // ... more candidates
        ]
    }
}
```

### 2. Create New Candidate
```javascript
POST /admin

Request Body:
{
    "name": "Candidate Name",
    "category": "Mr_Fresher"
}

Response:
{
    "status": "success",
    "candidate_id": "candidate_id",
    "data": {
        "candidate": {
            "name": "Candidate Name",
            "category": "Mr_Fresher",
            "vote": 0
        }
    }
}
```

### 3. Get All Messages
```javascript
GET /messages/all

Response:
{
    "status": "success",
    "results": 10,
    "data": {
        "messages": [
            {
                "message": "Message content",
                "user": {
                    "name": "Sender Name",
                    "email": "sender@iitdh.ac.in"
                }
            }
            // ... more messages
        ]
    }
}
```

### 4. Get Messages by Email
```javascript
GET /messages/user/:email

Response:
{
    "status": "success",
    "results": 2,
    "data": {
        "user": {
            "name": "Student Name",
            "email": "student@iitdh.ac.in"
        },
        "messages": [
            {
                "message": "Message content"
            }
            // ... more messages
        ]
    }
}
```

### 5. Get All Song Suggestions
```javascript
GET /songs/all

Response:
{
    "status": "success",
    "results": 10,
    "data": {
        "suggestions": [
            {
                "songLinks": ["..."],
                "user": {
                    "name": "Student Name",
                    "email": "student@iitdh.ac.in"
                }
            }
            // ... more suggestions
        ]
    }
}
```

## Error Handling

All errors follow this format:
```javascript
{
    "status": "error",
    "message": "Error description here"
}
```

Common error codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (not enough privileges)
- 404: Not Found
- 500: Server Error

## Validation Rules

1. Voting:
   - One vote per category per user
   - Must be verified to vote

2. Song Suggestions:
   - Maximum 3 songs per user
   - Can submit only once

3. Messages:
   - Maximum 100 words per message
   - Can send multiple messages

## Authentication Flow

1. User signs up → Receives OTP
2. Verifies OTP → Gets JWT token
3. Uses JWT token for all subsequent requests
4. Token must be included in Authorization header

## Socket.IO Integration

For real-time vote updates, connect to the WebSocket server:

```javascript
import { io } from "socket.io-client";

const socket = io("http://your-api-domain");

// Listen for vote updates
socket.on('voteUpdate', (data) => {
    console.log('New vote:', data);
    // data includes: candidateId, category, newVoteCount
});

// Listen for initial vote counts
socket.on('initialVoteCounts', (candidates) => {
    console.log('Current standings:', candidates);
});
```

## Rate Limiting

To prevent abuse, the API implements rate limiting:
- 100 requests per IP per 15 minutes for general endpoints
- 3 votes per user per category
- 3 song suggestions per user
