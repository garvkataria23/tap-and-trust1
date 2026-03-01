# Tap & Trust - Full Stack Setup

## 🎯 Project Structure

```
Tap & Trust/
├── src/                    # React Frontend
│   ├── react-app/         # Main app
│   └── shared/            # Shared utilities
├── backend/               # Node.js + Express Server
│   ├── server.js         # Express server
│   ├── models.js         # MongoDB schemas
│   ├── package.json      # Backend dependencies
│   └── .env              # MongoDB connection
└── [other files]
```

---

## 🚀 Quick Start

### **1. Install Frontend Dependencies**
```bash
cd "d:\fpppp\Tap & Trust"
npm install
```

### **2. Install Backend Dependencies**
```bash
cd backend
npm install
```

### **3. Run Both Servers (keep 2 terminals open)**

**Terminal 1 - Frontend (Port 5173):**
```bash
cd "d:\fpppp\Tap & Trust"
npm run dev
```

**Terminal 2 - Backend (Port 5000):**
```bash
cd "d:\fpppp\Tap & Trust\backend"
npm run dev
```

---

## 📱 Frontend (React - Unchanged)

- **Port:** http://localhost:5173
- **Auth:** localStorage (email + name)
- **Pages:** Dashboard, Profile, Games, Chat, Friends, Scanner, Discover
- **Features:** Dark/Light/Custom themes, QR generation, Games, etc.

✅ **Existing code fully preserved** - works exactly as before!

---

## 🗄️ Backend (Express + MongoDB)

- **Port:** http://localhost:5000
- **Database:** MongoDB Atlas (Cloud)
- **Connection:** Already configured in `.env`

### **API Endpoints:**

#### **Users**
- `POST /api/users` - Save/update user profile
- `GET /api/users/:email` - Get user profile

#### **Friends**
- `POST /api/friends` - Add friend connection
- `GET /api/friends/:userId` - Get all friends
- `PATCH /api/friends/:friendId` - Extend connection (24h more)

#### **Messages**
- `POST /api/messages` - Save message
- `GET /api/messages/:userId/:friendId` - Get chat history

#### **Games**
- `POST /api/games` - Save game result
- `GET /api/games/:userId` - Get game history

#### **Shoutouts**
- `POST /api/shoutouts` - Create post
- `GET /api/shoutouts` - Get all posts
- `GET /api/shoutouts/:userId` - Get user's posts
- `PATCH /api/shoutouts/:shoutoutId/like` - Like a post

#### **Health**
- `GET /api/health` - Check if backend is running

---

## 📊 MongoDB Collections

Automatically created:

1. **users** - User profiles (email, name, avatar, mood, bio, interests)
2. **friends** - Friend connections (userId, friendId, category, expires)
3. **messages** - Chat messages (sender, receiver, content, timestamp)
4. **games** - Game results (userId, gameType, score, result)
5. **shoutouts** - User posts (userId, content, likes, timestamp)

---

## 🔌 Frontend → Backend Connection

### **Optional: Sync to MongoDB**

Every page can optionally save to MongoDB. Example in Dashboard:

```typescript
import { saveUserProfile } from '@/shared/mongoAPI';

// When user updates profile
await saveUserProfile({
  email: user.email,
  name: user.name,
  mood: mood,
  bio: bio,
  interests: interests,
});
```

**⚠️ Currently:** Frontend uses localStorage only. Backend is ready whenever you want to sync!

---

## 🔐 Database Credentials

```
Connection: mongodb+srv://pranjallalwani46_db_user:sTnRNLJgLe5A2JVp@tap-trust.br6qjjs.mongodb.net/?appName=Tap-Trust
Database: tap-trust (auto-created)
```

### **Manage Database:**
1. Go to [MongoDB Atlas](https://account.mongodb.com/account)
2. Login with same credentials
3. Select "tap-trust" cluster
4. Go to Collections to see data

---

## ✅ What's Working

- ✅ Frontend: Fully functional (no changes made)
- ✅ Backend: Express server running
- ✅ MongoDB: Connected to Atlas cloud
- ✅ All API routes: Ready to use
- ✅ Games, Profile, Chat, Friends: All pages work

---

## 🔄 Data Flow

```
Frontend (localStorage)
    ↓
Optional: Save to Backend
    ↓
Backend (Express API)
    ↓
MongoDB Atlas (Cloud)
```

---

## 🛠️ Troubleshooting

### Backend not starting?
```bash
# Check if port 5000 is free
netstat -ano | findstr "5000"

# If in use, change PORT in backend/.env
PORT=5001
```

### MongoDB connection error?
- Check internet connection
- Verify `.env` has correct connection string
- MongoDB IP Whitelist: Allow 0.0.0.0/0 in Atlas security

### CORS error in frontend?
- Backend must be running on port 5000
- Make sure both servers are active

---

## 📝 Notes

- ✅ **Existing code NOT modified** - frontend untouched
- ✅ **Games feature working** - visible in Dashboard
- ✅ **PostgreSQL replaced with MongoDB** - using Atlas cloud
- ✅ **No passwords/secrets in frontend** - backend handles it
- ✅ **Can work offline** - localStorage fallback always works

---

**Everything ready to use! 🎉**
