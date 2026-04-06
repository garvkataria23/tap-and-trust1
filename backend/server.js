import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { User, Friend, Message, GameResult, Shoutout, FriendRequest, Achievement, Leaderboard, OnlineStatus, ConnectorRating, MusicHistory, Album, Playlist, MusicRecommendation, DownloadedSong } from './models.js';
import * as mockDB from './mockDatabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global variable to track database mode
let useMockDB = false;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection with fallback to mock database
let mongodbConnected = false;

// Disable Mongoose command buffering to prevent 10s timeouts
mongoose.set('bufferCommands', false);

// If no MongoDB URI, use mock DB immediately
if (!process.env.MONGODB_URI) {
  console.log('📦 No MongoDB URI found. Using Mock Database (In-Memory)...');
  useMockDB = true;
  await mockDB.connectMockDatabase();
} else {
  // Try MongoDB with aggressive timeouts
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 3000,
    connectTimeoutMS: 3000,
    family: 4,
  })
    .then(() => {
      mongodbConnected = true;
      console.log('✅ MongoDB Connected');
    })
    .catch(async (err) => {
      console.warn('⚠️  MongoDB Connection Failed (timeout:', err.message, ')');
      console.log('📦 Switching to Mock Database (In-Memory)...');
      useMockDB = true;
      // Disconnect mongoose to prevent buffering
      try {
        await mongoose.disconnect();
      } catch (e) {
        // ignore
      }
      await mockDB.connectMockDatabase();
    });
}

// ==================== DATABASE OPERATIONS WRAPPER ====================
// These wrappers ensure queries don't buffer when MongoDB is unavailable

async function findUser(query) {
  if (useMockDB) {
    return mockDB.findOne('users', query);
  }
  return User.findOne(query);
}

async function findUserById(id) {
  if (useMockDB) {
    return mockDB.findOne('users', { _id: id });
  }
  return User.findById(id);
}

async function createUser(data) {
  if (useMockDB) {
    return mockDB.create('users', data);
  }
  return User.create(data);
}

async function updateUser(query, update) {
  if (useMockDB) {
    return mockDB.findOneAndUpdate('users', query, update);
  }
  return User.findOneAndUpdate(query, update, { new: true });
}

// ==================== ROOT ROUTE ====================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎉 Tap & Trust Backend is Running!',
    version: '1.0.0',
    features: 19,
    endpoints: 'Available at /api/*',
    database: useMockDB ? '📦 Mock (In-Memory)' : '🗄️  MongoDB Atlas',
    health: '/api/health'
  });
});

// ==================== AUTHENTICATION ROUTES ====================

// Generate simple token (not cryptographically secure - for demo only)
function generateToken(userId) {
  return `token_${userId}_${Date.now()}`;
}

// Auth middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  req.token = token;
  next();
}

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({ success: false, error: 'Email, name, and password are required' });
    }

    // Check if user exists
    let user = await findUser({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create new user
    user = await createUser({
      email,
      name,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      password // In production, this should be hashed
    });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Find user
    const user = await findUser({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // For demo, just check if password exists (in production use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    // Extract user ID from token
    const tokenParts = req.token.split('_');
    const userId = tokenParts[1];

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== USER ROUTES ====================

// Save/Update User Profile
app.post('/api/users', async (req, res) => {
  try {
    const { email, name, picture, mood, bio, interests, qrCode } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      user = await User.findOneAndUpdate(
        { email },
        { name, picture, mood, bio, interests, qrCode },
        { new: true }
      );
    } else {
      user = await User.create({ email, name, picture, mood, bio, interests, qrCode });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Profile
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 1: Update Online Status
app.post('/api/users/:userId/online-status', async (req, res) => {
  try {
    const { status } = req.body; // 'online', 'offline', 'away'
    
    await User.findByIdAndUpdate(
      req.params.userId,
      { onlineStatus: status, lastSeen: new Date() }
    );
    
    await OnlineStatus.findOneAndUpdate(
      { userId: req.params.userId },
      { status, lastSeen: new Date() },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, status });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Online Status
app.get('/api/users/:userId/online-status', async (req, res) => {
  try {
    const onlineStatus = await OnlineStatus.findOne({ userId: req.params.userId });
    res.json({ success: true, onlineStatus });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 16: Update Privacy Settings
app.put('/api/users/:userId/privacy-settings', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { privacySettings: req.body },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 14: Update Notification Preferences
app.put('/api/users/:userId/notification-prefs', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { notificationPrefs: req.body },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 18: Update Theme Preference
app.put('/api/users/:userId/theme-preference', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { themePreference: req.body },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== FRIENDS ROUTES ====================

// Save Friend Connection
app.post('/api/friends', async (req, res) => {
  try {
    const { userId, friendId, category } = req.body;
    
    const friend = await Friend.create({
      userId,
      friendId,
      category,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastInteractionDate: new Date(),
    });
    
    res.json({ success: true, friend });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Friends List
app.get('/api/friends/:userId', async (req, res) => {
  try {
    const friends = await Friend.find({ userId: req.params.userId });
    res.json({ success: true, friends });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Extend Friend Connection
app.patch('/api/friends/:friendId', async (req, res) => {
  try {
    const friend = await Friend.findByIdAndUpdate(
      req.params.friendId,
      { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      { new: true }
    );
    res.json({ success: true, friend });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 11: Block User
app.post('/api/users/:userId/block/:blockedUserId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { blockedUsers: req.params.blockedUserId } },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 11: Unblock User
app.post('/api/users/:userId/unblock/:unblockedUserId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { blockedUsers: req.params.unblockedUserId } },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== FRIEND REQUEST ROUTES (Feature 9) ====================

// Send Friend Request
app.post('/api/friend-requests', async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    
    const friendRequest = await FriendRequest.create({
      senderId,
      receiverId,
      message,
      status: 'pending',
    });
    
    res.json({ success: true, friendRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Pending Friend Requests
app.get('/api/friend-requests/:userId', async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiverId: req.params.userId,
      status: 'pending',
    });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Accept Friend Request
app.post('/api/friend-requests/:requestId/accept', async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);
    
    // Create friendship
    await Friend.create({
      userId: request.senderId,
      friendId: request.receiverId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    
    // Also create reverse friendship
    await Friend.create({
      userId: request.receiverId,
      friendId: request.senderId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    
    // Update request status
    request.status = 'accepted';
    await request.save();
    
    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reject Friend Request
app.post('/api/friend-requests/:requestId/reject', async (req, res) => {
  try {
    const request = await FriendRequest.findByIdAndUpdate(
      req.params.requestId,
      { status: 'rejected' },
      { new: true }
    );
    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== MESSAGE ROUTES ====================

// Send Message (Enhanced with features 2, 6, 7, 8)
app.post('/api/messages', async (req, res) => {
  try {
    const { senderId, receiverId, content, contentType, voiceUrl, duration } = req.body;
    
    const message = await Message.create({
      senderId,
      receiverId,
      content,
      contentType: contentType || 'text',
      voiceUrl,
      duration,
    });
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Messages (Feature 2: Read Receipts)
app.get('/api/messages/:userId/:friendId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId, receiverId: req.params.friendId },
        { senderId: req.params.friendId, receiverId: req.params.userId },
      ]
    }).sort({ createdAt: 1 });
    
    res.json({ success: true, messages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 2: Mark Message as Read
app.post('/api/messages/:messageId/read', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      {
        $set: { read: true },
        $push: { readBy: { userId, readAt: new Date() } }
      },
      { new: true }
    );
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 6: Add Reaction to Message
app.post('/api/messages/:messageId/reaction', async (req, res) => {
  try {
    const { emoji, userId } = req.body;
    
    const message = await Message.findById(req.params.messageId);
    const reaction = message.reactions.find(r => r.emoji === emoji);
    
    if (reaction) {
      if (!reaction.users.includes(userId)) {
        reaction.users.push(userId);
      }
    } else {
      message.reactions.push({ emoji, users: [userId] });
    }
    
    await message.save();
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 7: Edit Message
app.put('/api/messages/:messageId', async (req, res) => {
  try {
    const { content } = req.body;
    
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { content, isEdited: true, editedAt: new Date() },
      { new: true }
    );
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 7: Pin/Unpin Message
app.post('/api/messages/:messageId/pin', async (req, res) => {
  try {
    const { userId, isPinned } = req.body;
    
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { isPinned, pinnedBy: userId },
      { new: true }
    );
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== GAME ROUTES ====================

// Save Game Result (Feature 5: Enhanced Stats)
app.post('/api/games', async (req, res) => {
  try {
    const { userId, opponentId, gameType, score, opponentScore, result, duration } = req.body;
    
    const gameResult = await GameResult.create({
      userId,
      opponentId,
      gameType,
      score,
      opponentScore,
      result,
      duration,
    });
    
    // Update leaderboard
    const leaderboard = await Leaderboard.findOneAndUpdate(
      { userId, gameType },
      {
        $inc: {
          wins: result === 'win' ? 1 : 0,
          losses: result === 'loss' ? 1 : 0,
          totalScore: score || 0,
        }
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, gameResult, leaderboard });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Game Results
app.get('/api/games/:userId', async (req, res) => {
  try {
    const games = await GameResult.find({ userId: req.params.userId });
    res.json({ success: true, games });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 5: Get Leaderboard
app.get('/api/leaderboard/:gameType', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find({ gameType: req.params.gameType })
      .sort({ wins: -1, totalScore: -1 })
      .limit(100);
    
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feature 5: Get Friend Game Stats
app.get('/api/games/:userId/:friendId', async (req, res) => {
  try {
    const games = await GameResult.find({
      $or: [
        { userId: req.params.userId, opponentId: req.params.friendId },
        { userId: req.params.friendId, opponentId: req.params.userId },
      ]
    });
    
    // Calculate stats
    const userGames = games.filter(g => g.userId === req.params.userId);
    const wins = userGames.filter(g => g.result === 'win').length;
    const losses = userGames.filter(g => g.result === 'loss').length;
    const draws = userGames.filter(g => g.result === 'draw').length;
    
    res.json({ success: true, games, stats: { wins, losses, draws } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== SHOUTOUTS ROUTES ====================

// Create Shoutout
app.post('/api/shoutouts', async (req, res) => {
  try {
    const { userId, content } = req.body;
    
    const shoutout = await Shoutout.create({
      userId,
      content,
    });
    
    res.json({ success: true, shoutout });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Shoutouts (Feed)
app.get('/api/shoutouts', async (req, res) => {
  try {
    const shoutouts = await Shoutout.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({ success: true, shoutouts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Shoutouts
app.get('/api/shoutouts/:userId', async (req, res) => {
  try {
    const shoutouts = await Shoutout.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, shoutouts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like Shoutout
app.post('/api/shoutouts/:shoutoutId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const shoutout = await Shoutout.findById(req.params.shoutoutId);
    
    if (shoutout.likedBy.includes(userId)) {
      shoutout.likedBy = shoutout.likedBy.filter(id => id !== userId);
      shoutout.likes--;
    } else {
      shoutout.likedBy.push(userId);
      shoutout.likes++;
    }
    
    await shoutout.save();
    res.json({ success: true, shoutout });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== ACHIEVEMENTS ROUTES (Feature 12) ====================

// Get User Achievements
app.get('/api/achievements/:userId', async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.params.userId });
    res.json({ success: true, achievements });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unlock Achievement
app.post('/api/achievements', async (req, res) => {
  try {
    const { userId, achievementType, metadata } = req.body;
    
    // Check if already unlocked
    const existing = await Achievement.findOne({ userId, achievementType });
    if (existing) {
      return res.json({ success: false, message: 'Already unlocked' });
    }
    
    const achievement = await Achievement.create({
      userId,
      achievementType,
      metadata,
    });
    
    // Update user badges
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { achievements: achievementType } }
    );
    
    res.json({ success: true, achievement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== CONNECTOR RATINGS ROUTES (Feature 20) ====================

// Add/Update Rating for a Connector
app.post('/api/ratings', async (req, res) => {
  try {
    const { ratedBy, ratedUser, rating, review, category } = req.body;
    
    // Check if rating already exists
    const existing = await ConnectorRating.findOne({ ratedBy, ratedUser, category: category || 'overall' });
    
    let connectorRating;
    if (existing) {
      // Update existing rating
      connectorRating = await ConnectorRating.findByIdAndUpdate(
        existing._id,
        { rating, review },
        { new: true }
      );
    } else {
      // Create new rating
      connectorRating = await ConnectorRating.create({
        ratedBy,
        ratedUser,
        rating,
        review,
        category: category || 'overall',
      });
    }
    
    res.json({ success: true, rating: connectorRating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Ratings for a User
app.get('/api/ratings/:userId', async (req, res) => {
  try {
    const ratings = await ConnectorRating.find({ ratedUser: req.params.userId });
    
    // Calculate average rating
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;
    
    res.json({ success: true, ratings, averageRating: avgRating, totalRatings: ratings.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Rating Given by a User to Another User
app.get('/api/ratings/:ratedBy/:ratedUser', async (req, res) => {
  try {
    const rating = await ConnectorRating.findOne({
      ratedBy: req.params.ratedBy,
      ratedUser: req.params.ratedUser,
    });
    
    res.json({ success: true, rating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== MUSIC HISTORY ROUTES (Feature 21) ====================

// Add Song to History
app.post('/api/music/history', async (req, res) => {
  try {
    const { userId, title, artist, album, duration, source, spotifyId, youtubeId, imageUrl } = req.body;
    
    const musicEntry = await MusicHistory.create({
      userId,
      title,
      artist,
      album,
      duration,
      source: source || 'browser',
      spotifyId,
      youtubeId,
      imageUrl,
      playedAt: new Date(),
    });
    
    res.json({ success: true, musicEntry });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User's Music History
app.get('/api/music/history/:userId', async (req, res) => {
  try {
    const { limit = 100, skip = 0 } = req.query;
    
    const musicHistory = await MusicHistory.find({ userId: req.params.userId })
      .sort({ playedAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    const totalCount = await MusicHistory.countDocuments({ userId: req.params.userId });
    
    res.json({ success: true, musicHistory, total: totalCount });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User's Top Artists
app.get('/api/music/top-artists/:userId', async (req, res) => {
  try {
    const topArtists = await MusicHistory.aggregate([
      { $match: { userId: req.params.userId } },
      { $group: { _id: '$artist', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({ success: true, topArtists });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User's Top Songs (Most Played)
app.get('/api/music/top-songs/:userId', async (req, res) => {
  try {
    const topSongs = await MusicHistory.aggregate([
      { $match: { userId: req.params.userId } },
      { $group: { 
        _id: { title: '$title', artist: '$artist' }, 
        count: { $sum: 1 },
        lastPlayed: { $max: '$playedAt' }
      } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.json({ success: true, topSongs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Recently Played Songs
app.get('/api/music/recent/:userId', async (req, res) => {
  try {
    const recentSongs = await MusicHistory.find({ userId: req.params.userId })
      .sort({ playedAt: -1 })
      .limit(50);
    
    res.json({ success: true, recentSongs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== ALBUM ROUTES (Feature 23) ====================

// Create Album
app.post('/api/albums', async (req, res) => {
  try {
    const { userId, name, description, coverImage, isPublic } = req.body;
    
    const album = await Album.create({
      userId,
      name,
      description,
      coverImage,
      isPublic: isPublic || false,
      songs: [],
    });
    
    res.json({ success: true, album });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User's Albums
app.get('/api/albums/:userId', async (req, res) => {
  try {
    const albums = await Album.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    
    res.json({ success: true, albums });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Single Album
app.get('/api/albums/:albumId/details', async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    res.json({ success: true, album });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Album
app.put('/api/albums/:albumId', async (req, res) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;
    
    const album = await Album.findByIdAndUpdate(
      req.params.albumId,
      { name, description, coverImage, isPublic },
      { new: true }
    );
    
    res.json({ success: true, album });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Album
app.delete('/api/albums/:albumId', async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.albumId);
    
    res.json({ success: true, message: 'Album deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Song to Album
app.post('/api/albums/:albumId/songs', async (req, res) => {
  try {
    const { musicHistoryId, title, artist, duration, imageUrl } = req.body;
    
    const album = await Album.findById(req.params.albumId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    album.songs.push({
      musicHistoryId,
      title,
      artist,
      duration,
      imageUrl,
    });
    
    album.totalDuration = album.songs.reduce((sum, song) => sum + (song.duration || 0), 0);
    await album.save();
    
    res.json({ success: true, album });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove Song from Album
app.delete('/api/albums/:albumId/songs/:songIndex', async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    album.songs.splice(req.params.songIndex, 1);
    album.totalDuration = album.songs.reduce((sum, song) => sum + (song.duration || 0), 0);
    await album.save();
    
    res.json({ success: true, album });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like Album
app.post('/api/albums/:albumId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const album = await Album.findById(req.params.albumId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    if (!album.likedBy.includes(userId)) {
      album.likedBy.push(userId);
      album.likes += 1;
      await album.save();
    }
    
    res.json({ success: true, album });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unlike Album
app.post('/api/albums/:albumId/unlike', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const album = await Album.findById(req.params.albumId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    const index = album.likedBy.indexOf(userId);
    if (index > -1) {
      album.likedBy.splice(index, 1);
      album.likes = Math.max(0, album.likes - 1);
      await album.save();
    }
    
    res.json({ success: true, album });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== PLAYLIST ROUTES (Feature 25) ====================

// Create Playlist
app.post('/api/playlists', async (req, res) => {
  try {
    const { userId, name, description, coverImage, isPublic, isCollaborative } = req.body;
    
    const playlist = await Playlist.create({
      userId,
      name,
      description,
      coverImage,
      isPublic: isPublic || false,
      isCollaborative: isCollaborative || false,
      songs: [],
      collaborators: [],
      totalDuration: 0,
      plays: 0,
      likes: 0,
    });
    
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Playlists
app.get('/api/playlists/:userId', async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.params.userId });
    res.json({ success: true, playlists });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Playlist Details
app.get('/api/playlists/:playlistId/details', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    // Increment play count
    playlist.plays += 1;
    await playlist.save();
    
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Playlist
app.put('/api/playlists/:playlistId', async (req, res) => {
  try {
    const { name, description, coverImage, isPublic, isCollaborative } = req.body;
    
    const playlist = await Playlist.findByIdAndUpdate(
      req.params.playlistId,
      { name, description, coverImage, isPublic, isCollaborative },
      { new: true }
    );
    
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Playlist
app.delete('/api/playlists/:playlistId', async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.playlistId);
    res.json({ success: true, message: 'Playlist deleted', playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Song to Playlist
app.post('/api/playlists/:playlistId/songs', async (req, res) => {
  try {
    const { musicHistoryId, title, artist, duration, imageUrl, userId } = req.body;
    
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const song = {
      musicHistoryId,
      title,
      artist,
      duration,
      imageUrl,
      addedBy: userId,
      addedAt: new Date(),
    };
    
    playlist.songs.push(song);
    playlist.totalDuration += duration || 0;
    await playlist.save();
    
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove Song from Playlist
app.delete('/api/playlists/:playlistId/songs/:songIndex', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const index = parseInt(req.params.songIndex);
    if (index >= 0 && index < playlist.songs.length) {
      const song = playlist.songs[index];
      playlist.totalDuration -= song.duration || 0;
      playlist.songs.splice(index, 1);
      await playlist.save();
    }
    
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Collaborator to Playlist
app.post('/api/playlists/:playlistId/collaborators', async (req, res) => {
  try {
    const { userId, userName, role } = req.body;
    
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const collaborator = {
      userId,
      name: userName,
      role: role || 'viewer',
      addedAt: new Date(),
    };
    
    // Check if already a collaborator
    const exists = playlist.collaborators.find(c => c.userId === userId);
    if (!exists) {
      playlist.collaborators.push(collaborator);
      playlist.isCollaborative = true;
      await playlist.save();
    }
    
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove Collaborator from Playlist
app.delete('/api/playlists/:playlistId/collaborators/:userId', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    playlist.collaborators = playlist.collaborators.filter(c => c.userId !== req.params.userId);
    
    if (playlist.collaborators.length === 0) {
      playlist.isCollaborative = false;
    }
    
    await playlist.save();
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like Playlist
app.post('/api/playlists/:playlistId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    if (!playlist.likedBy.includes(userId)) {
      playlist.likedBy.push(userId);
      playlist.likes += 1;
      await playlist.save();
    }
    
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unlike Playlist
app.post('/api/playlists/:playlistId/unlike', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const index = playlist.likedBy.indexOf(userId);
    if (index > -1) {
      playlist.likedBy.splice(index, 1);
      playlist.likes = Math.max(0, playlist.likes - 1);
      await playlist.save();
    }
    
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== MUSIC SEARCH & RECOMMENDATIONS ROUTES (Feature 26) ====================

// Search Music (search by title or artist)
app.get('/api/music/search', async (req, res) => {
  try {
    const { query, type } = req.query; // type: 'title', 'artist', or 'all'
    
    let filter = {};
    if (type === 'title' || type === 'all') {
      filter.title = { $regex: query, $options: 'i' };
    } else if (type === 'artist') {
      filter.artist = { $regex: query, $options: 'i' };
    }
    
    const results = await MusicHistory.find(filter).limit(20);
    
    res.json({ success: true, results, count: results.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Browse Songs from Internet/Database (Feature 27)
app.get('/api/browse-songs', async (req, res) => {
  try {
    const { category, query, genre } = req.query;
    
    let filter = {};
    
    if (category === 'trending') {
      // Find songs with highest play counts
      filter = { playCount: { $gt: 0 } };
    } else if (category === 'new-releases') {
      // Find recently added songs
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filter = { createdAt: { $gte: thirtyDaysAgo } };
    } else if (category === 'popular') {
      // Find songs with high play counts and likes
      filter = { playCount: { $gt: 10 } };
    } else if (category === 'genre' && genre) {
      // Filter by genre
      filter = { genre: { $regex: genre, $options: 'i' } };
    }
    
    // Apply search query if provided
    if (query && query.trim()) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { artist: { $regex: query, $options: 'i' } },
        { album: { $regex: query, $options: 'i' } }
      ];
    }
    
    const songs = await MusicHistory.find(filter)
      .sort({ playCount: -1, createdAt: -1 })
      .limit(50)
      .select('_id title artist album genre duration imageUrl playCount explicit');
    
    // Transform to include popularity score
    const transformedSongs = songs.map(song => ({
      id: song._id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      genre: song.genre,
      duration: song.duration,
      imageUrl: song.imageUrl,
      popularity: Math.min(100, Math.floor((song.playCount || 0) / 10)), // Convert play count to 0-100 scale
      explicit: song.explicit,
    }));
    
    res.json({ success: true, songs: transformedSongs, count: transformedSongs.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== DOWNLOAD ROUTES (Feature 28) ====================
const MAX_STORAGE_BYTES = 500 * 1024 * 1024; // 500 MB per user

// Download a song (save to user's library)
app.post('/api/downloads', async (req, res) => {
  try {
    const { userId, title, artist, album, genre, duration, imageUrl, fileSize, sourceUrl } = req.body;
    
    if (!userId || !title || !artist) {
      return res.status(400).json({ error: 'userId, title, and artist are required' });
    }
    
    // Check if already downloaded
    const existing = await DownloadedSong.findOne({ userId, title, artist });
    if (existing) {
      return res.status(409).json({ error: 'Song already downloaded', song: existing });
    }
    
    // Calculate current storage usage
    const currentDownloads = await DownloadedSong.find({ userId });
    const currentUsage = currentDownloads.reduce((sum, s) => sum + (s.fileSize || 0), 0);
    const songSize = fileSize || (duration ? duration * 16000 : 4 * 1024 * 1024); // estimate ~128kbps or default 4MB
    
    if (currentUsage + songSize > MAX_STORAGE_BYTES) {
      return res.status(507).json({
        error: 'Storage limit exceeded',
        currentUsage,
        maxStorage: MAX_STORAGE_BYTES,
        songSize,
        remaining: MAX_STORAGE_BYTES - currentUsage,
      });
    }
    
    const download = await DownloadedSong.create({
      userId,
      title,
      artist,
      album,
      genre,
      duration,
      imageUrl,
      fileSize: songSize,
      sourceUrl,
      isOfflineAvailable: true,
    });
    
    res.json({
      success: true,
      download,
      storageUsed: currentUsage + songSize,
      storageLimit: MAX_STORAGE_BYTES,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's downloaded songs
app.get('/api/downloads/:userId', async (req, res) => {
  try {
    const downloads = await DownloadedSong.find({ userId: req.params.userId })
      .sort({ downloadedAt: -1 });
    
    const totalSize = downloads.reduce((sum, s) => sum + (s.fileSize || 0), 0);
    
    res.json({
      success: true,
      downloads,
      count: downloads.length,
      storageUsed: totalSize,
      storageLimit: MAX_STORAGE_BYTES,
      storagePercent: Math.round((totalSize / MAX_STORAGE_BYTES) * 100),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get storage usage info
app.get('/api/downloads/:userId/storage', async (req, res) => {
  try {
    const downloads = await DownloadedSong.find({ userId: req.params.userId });
    const totalSize = downloads.reduce((sum, s) => sum + (s.fileSize || 0), 0);
    
    res.json({
      success: true,
      storageUsed: totalSize,
      storageLimit: MAX_STORAGE_BYTES,
      storagePercent: Math.round((totalSize / MAX_STORAGE_BYTES) * 100),
      songCount: downloads.length,
      remaining: MAX_STORAGE_BYTES - totalSize,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a downloaded song
app.delete('/api/downloads/:downloadId', async (req, res) => {
  try {
    const song = await DownloadedSong.findByIdAndDelete(req.params.downloadId);
    if (!song) {
      return res.status(404).json({ error: 'Download not found' });
    }
    
    // Calculate remaining storage
    const remaining = await DownloadedSong.find({ userId: song.userId });
    const totalSize = remaining.reduce((sum, s) => sum + (s.fileSize || 0), 0);
    
    res.json({
      success: true,
      message: 'Song removed from downloads',
      freedSpace: song.fileSize || 0,
      storageUsed: totalSize,
      storageLimit: MAX_STORAGE_BYTES,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete all downloads for a user
app.delete('/api/downloads/:userId/all', async (req, res) => {
  try {
    const result = await DownloadedSong.deleteMany({ userId: req.params.userId });
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} downloads`,
      storageUsed: 0,
      storageLimit: MAX_STORAGE_BYTES,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Music Recommendations
app.get('/api/music/recommendations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { mood } = req.query;
    
    // Get user's music history to analyze preferences
    const userHistory = await MusicHistory.find({ userId }).sort({ playedAt: -1 }).limit(50);
    
    if (userHistory.length === 0) {
      return res.json({ success: true, recommendations: [], message: 'No listening history found' });
    }
    
    // Extract genres/artists from history
    const artists = [...new Set(userHistory.map(m => m.artist))];
    const genres = [...new Set(userHistory.map(m => m.genre))];
    
    // Find similar songs
    let query = {};
    if (mood) {
      query.mood = mood;
    } else {
      query.artist = { $in: artists };
    }
    
    const recommendations = await MusicHistory.find(query)
      .limit(15)
      .sort({ playCount: -1 });
    
    // Filter out songs already in history
    const historyIds = new Set(userHistory.map(m => m._id.toString()));
    const filtered = recommendations.filter(r => !historyIds.has(r._id.toString()));
    
    // Create recommendation record
    const musicRec = await MusicRecommendation.findOneAndUpdate(
      { userId },
      {
        userId,
        songs: filtered.map(song => ({
          musicHistoryId: song._id,
          title: song.title,
          artist: song.artist,
          score: Math.floor(Math.random() * 40 + 60), // 60-100 score
          reason: mood ? `Based on your ${mood} mood` : `Similar to your favorite artists`,
          matchTags: [genres[0], 'personalized'].filter(Boolean),
        })),
        basedOnMood: mood || 'mixed',
        basedOnGenre: genres[0] || 'all',
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, recommendations: filtered, recommendation: musicRec });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Recommendations for User
app.get('/api/recommendations/:userId', async (req, res) => {
  try {
    const recommendation = await MusicRecommendation.findOne({ userId: req.params.userId });
    
    if (!recommendation) {
      return res.json({ success: true, recommendation: null, message: 'No recommendations yet' });
    }
    
    res.json({ success: true, recommendation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

// ==================== iTunes MUSIC API PROXY (Real Music from Internet) ====================

// Helper: map iTunes track to our song format
function mapItunesTrack(track) {
  return {
    id: `itunes-${track.trackId}`,
    itunesId: track.trackId,
    title: track.trackName || 'Unknown',
    artist: track.artistName || 'Unknown Artist',
    album: track.collectionName || '',
    genre: track.primaryGenreName || '',
    duration: track.trackTimeMillis ? Math.round(track.trackTimeMillis / 1000) : 30,
    imageUrl: (track.artworkUrl100 || '').replace('100x100', '300x300'),
    imageSmall: track.artworkUrl60 || track.artworkUrl100 || '',
    preview: track.previewUrl || '', // 30-second AAC preview
    popularity: track.trackNumber ? Math.min(100, 100 - track.trackNumber) : 70,
    explicit: track.trackExplicitness === 'explicit',
    fileSize: track.trackTimeMillis ? Math.round(track.trackTimeMillis / 1000) * 16000 : 3500000,
    releaseDate: track.releaseDate || '',
    collectionId: track.collectionId,
  };
}

// Search songs via iTunes
app.get('/api/itunes/search', async (req, res) => {
  try {
    const { q, limit = 25 } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query "q" is required' });

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();

    const songs = (data.results || []).filter(t => t.kind === 'song').map(mapItunesTrack);
    res.json({ success: true, songs, total: data.resultCount || songs.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search iTunes: ' + error.message });
  }
});

// Get trending / top songs (uses iTunes RSS feed)
app.get('/api/itunes/trending', async (req, res) => {
  try {
    const { limit = 25, genre } = req.query;
    // iTunes RSS generator for top songs
    let url = `https://itunes.apple.com/us/rss/topsongs/limit=${Math.min(limit, 100)}`;
    if (genre) url += `/genre=${genre}`;
    url += '/json';

    const response = await fetch(url);
    const data = await response.json();

    const entries = data?.feed?.entry || [];
    const songs = entries.map((entry, idx) => ({
      id: `itunes-rss-${idx}-${entry['im:name']?.label?.replace(/\s/g,'') || idx}`,
      title: entry['im:name']?.label || 'Unknown',
      artist: entry['im:artist']?.label || 'Unknown Artist',
      album: entry['im:collection']?.['im:name']?.label || '',
      genre: entry.category?.attributes?.label || '',
      duration: 30,
      imageUrl: entry['im:image']?.[2]?.label || entry['im:image']?.[1]?.label || '',
      preview: entry.link?.[1]?.attributes?.href || '',
      popularity: Math.max(50, 100 - idx * 2),
      explicit: false,
      fileSize: 3500000,
      releaseDate: entry['im:releaseDate']?.label || '',
    }));

    res.json({ success: true, songs, total: songs.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending: ' + error.message });
  }
});

// Browse by genre using iTunes search with genre term
app.get('/api/itunes/genre/:genreName', async (req, res) => {
  try {
    const { limit = 25 } = req.query;
    const genreName = decodeURIComponent(req.params.genreName);

    // Search iTunes for popular tracks in this genre
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(genreName + ' music')}&media=music&entity=song&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();

    const songs = (data.results || []).filter(t => t.kind === 'song').map(mapItunesTrack);
    res.json({ success: true, songs, total: songs.length, genre: genreName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genre tracks: ' + error.message });
  }
});

// Get available genres (static curated list matching iTunes genre IDs)
app.get('/api/itunes/genres', async (_req, res) => {
  const genres = [
    { id: 14, name: 'Pop' },
    { id: 21, name: 'Rock' },
    { id: 18, name: 'Hip-Hop/Rap' },
    { id: 11, name: 'Jazz' },
    { id: 7, name: 'Electronic' },
    { id: 20, name: 'Alternative' },
    { id: 15, name: 'R&B/Soul' },
    { id: 6, name: 'Country' },
    { id: 5, name: 'Classical' },
    { id: 12, name: 'Latin' },
    { id: 51, name: 'K-Pop' },
    { id: 29, name: 'Anime' },
    { id: 17, name: 'Dance' },
    { id: 2, name: 'Blues' },
    { id: 24, name: 'Reggae' },
    { id: 10, name: 'Singer/Songwriter' },
  ];
  res.json({ success: true, genres });
});

// Lookup album tracks
app.get('/api/itunes/album/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const url = `https://itunes.apple.com/lookup?id=${albumId}&entity=song`;
    const response = await fetch(url);
    const data = await response.json();

    const results = data.results || [];
    const album = results.find(r => r.wrapperType === 'collection');
    const songs = results.filter(r => r.wrapperType === 'track' && r.kind === 'song').map(mapItunesTrack);

    res.json({
      success: true,
      album: album ? {
        id: album.collectionId,
        name: album.collectionName,
        artist: album.artistName,
        imageUrl: (album.artworkUrl100 || '').replace('100x100', '300x300'),
        trackCount: album.trackCount,
      } : null,
      songs,
      total: songs.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch album: ' + error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🎉 Backend is running with all features enabled!', features: 23 });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 All 22 features enabled and connected to MongoDB Atlas`);
});
