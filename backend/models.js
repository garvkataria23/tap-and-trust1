import mongoose from 'mongoose';

// User Profile Schema - Enhanced with all new features
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: String,
    mood: { type: String, enum: ['Chill', 'Looking to Collaborate', 'Just Browsing', 'Open to Talk'] },
    bio: String,
    interests: [String],
    qrCode: String,
    
    // Feature 1: Online Status & Typing Indicators
    onlineStatus: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
    lastSeen: { type: Date, default: Date.now },
    
    // Feature 10: User Discovery
    discoveryPreferences: {
      showInDiscovery: { type: Boolean, default: true },
      visibleInterests: { type: Boolean, default: true },
    },
    
    // Feature 11: User Blocking
    blockedUsers: [{ type: String }], // Array of blocked user IDs
    
    // Feature 12: Achievements & Badges
    achievements: [String], // Array of achievement IDs
    badges: [String],
    
    // Feature 14: Notifications Settings
    notificationPrefs: {
      messageNotifications: { type: Boolean, default: true },
      gameInviteNotifications: { type: Boolean, default: true },
      friendRequestNotifications: { type: Boolean, default: true },
      muteNotificationsUntil: Date,
    },
    
    // Feature 15: Chat Organization
    chatFolders: [
      {
        name: String,
        friendIds: [String],
      }
    ],
    
    // Feature 16: Privacy Settings
    privacySettings: {
      showOnlineStatus: { type: Boolean, default: true },
      showLastSeen: { type: Boolean, default: true },
      allowProfileView: { type: String, enum: ['everyone', 'friends-only', 'private'], default: 'friends-only' },
      allowGameInvites: { type: Boolean, default: true },
    },
    
    // Feature 17: Chat Themes
    chatThemes: {
      defaultTheme: { type: String, default: 'light' },
      perFriendTheme: [
        {
          friendId: String,
          theme: String,
        }
      ],
    },
    
    // Feature 18: Night Mode/Auto Theme
    themePreference: {
      mode: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
      autoSwitchTime: String, // Format: "19:00-07:00"
    },
  },
  { timestamps: true }
);

// Friends Schema - Enhanced
const friendSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    friendId: { type: String, required: true },
    category: { type: String, enum: ['Event', 'Classmate', 'Random Meet', 'Work'] },
    expiresAt: Date,
    status: { type: String, default: 'active' },
    
    // Feature 13: Friend Streaks
    streakDays: { type: Number, default: 0 },
    lastInteractionDate: Date,
  },
  { timestamps: true }
);

// Messages Schema - Enhanced with all message features
const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    
    // Feature 2: Message Read Receipts
    read: { type: Boolean, default: false },
    readBy: [
      {
        userId: String,
        readAt: Date,
      }
    ],
    
    // Feature 6: Emoji Picker & Reactions
    reactions: [
      {
        emoji: String,
        users: [String],
      }
    ],
    
    // Feature 7: Message Features (edit, delete, pin)
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
    isPinned: { type: Boolean, default: false },
    pinnedBy: String,
    
    // Feature 8: Voice Notes
    contentType: { type: String, enum: ['text', 'voice', 'image'], default: 'text' },
    voiceUrl: String,
    duration: Number, // Duration in seconds for voice messages
  },
  { timestamps: true }
);

// Game Results Schema - Enhanced with more stats
const gameResultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    opponentId: String,
    gameType: { type: String, enum: ['rockpaperscissors', 'trivia', 'tictactoe', 'wordguess', 'numberguess', 'memory'], required: true },
    score: Number,
    opponentScore: Number,
    result: { type: String, enum: ['win', 'loss', 'draw'] },
    
    // Feature 5: Game Statistics
    duration: Number, // Duration in seconds
    difficulty: String,
  },
  { timestamps: true }
);

// Shoutouts Schema - Enhanced
const shoutoutSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [String],
    comments: [
      {
        userId: String,
        content: String,
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);

// Friend Requests Schema - NEW (Feature 9)
const friendRequestSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: String,
  },
  { timestamps: true }
);

// Achievements Schema - NEW (Feature 12)
const achievementSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    achievementType: String, // 'first_message', 'gaming_master', 'streaker', etc
    unlockedAt: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed, // Additional data like streak count
  },
  { timestamps: true }
);

// Leaderboard Schema - NEW (Feature 5)
const leaderboardSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: String,
    gameType: String,
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    rank: Number,
  },
  { timestamps: true }
);

// Online Status Schema - NEW (Feature 1)
const onlineStatusSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
    lastSeen: { type: Date, default: Date.now },
    currentlyTypingTo: String, // Which friend user is typing to
  },
  { timestamps: true }
);

// Connector Rating Schema - NEW (Feature 20)
const connectorRatingSchema = new mongoose.Schema(
  {
    ratedBy: { type: String, required: true }, // User ID who gave the rating
    ratedUser: { type: String, required: true }, // User ID being rated
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 star rating
    review: String, // Optional written review
    category: { type: String, enum: ['communication', 'reliability', 'friendliness', 'fun', 'overall'], default: 'overall' },
  },
  { timestamps: true }
);

// Music History Schema - NEW (Feature 21)
const musicHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    artist: String,
    album: String,
    duration: Number, // Duration in seconds
    source: { type: String, enum: ['spotify', 'youtube', 'apple-music', 'browser', 'other'], default: 'browser' },
    spotifyId: String, // For Spotify integration
    youtubeId: String, // For YouTube integration
    imageUrl: String, // Album cover or thumbnail
    playedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Downloaded Songs Schema - Track user downloads with storage limit
const downloadedSongSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: String,
    genre: String,
    duration: Number,
    imageUrl: String,
    fileSize: { type: Number, default: 0 }, // Size in bytes
    sourceUrl: String,
    isOfflineAvailable: { type: Boolean, default: true },
    downloadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// User Album Schema - NEW (Feature 23)
const albumSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    coverImage: String, // URL to album cover image
    isPublic: { type: Boolean, default: false },
    songs: [
      {
        musicHistoryId: String, // Reference to MusicHistory entry
        title: String,
        artist: String,
        duration: Number,
        imageUrl: String,
        addedAt: { type: Date, default: Date.now },
      }
    ],
    likes: { type: Number, default: 0 },
    likedBy: [String], // Array of user IDs who liked it
    totalDuration: { type: Number, default: 0 }, // Total duration of all songs
  },
  { timestamps: true }
);

// Playlist Schema - NEW (for playlist creation & management)
const playlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    coverImage: String,
    isPublic: { type: Boolean, default: false },
    isCollaborative: { type: Boolean, default: false },
    songs: [
      {
        musicHistoryId: String,
        title: String,
        artist: String,
        duration: Number,
        imageUrl: String,
        addedBy: String, // User who added the song
        addedAt: { type: Date, default: Date.now },
      }
    ],
    collaborators: [
      {
        userId: String,
        name: String,
        role: { type: String, enum: ['editor', 'viewer'], default: 'viewer' },
        addedAt: { type: Date, default: Date.now },
      }
    ],
    totalDuration: { type: Number, default: 0 },
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [String],
  },
  { timestamps: true }
);

// Music Recommendation Schema - NEW (for personalized recommendations)
const musicRecommendationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    songs: [
      {
        musicHistoryId: String,
        title: String,
        artist: String,
        score: Number, // Recommendation score (0-100)
        reason: String, // e.g., "Based on your mood", "Popular in your genre"
        matchTags: [String], // Tags that matched
        addedAt: { type: Date, default: Date.now },
      }
    ],
    generatedAt: { type: Date, default: Date.now },
    basedOnMood: String,
    basedOnGenre: String,
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
export const Friend = mongoose.model('Friend', friendSchema);
export const Message = mongoose.model('Message', messageSchema);
export const GameResult = mongoose.model('GameResult', gameResultSchema);
export const Shoutout = mongoose.model('Shoutout', shoutoutSchema);
export const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
export const Achievement = mongoose.model('Achievement', achievementSchema);
export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export const OnlineStatus = mongoose.model('OnlineStatus', onlineStatusSchema);
export const ConnectorRating = mongoose.model('ConnectorRating', connectorRatingSchema);
export const MusicHistory = mongoose.model('MusicHistory', musicHistorySchema);
export const Album = mongoose.model('Album', albumSchema);
export const Playlist = mongoose.model('Playlist', playlistSchema);
export const MusicRecommendation = mongoose.model('MusicRecommendation', musicRecommendationSchema);
export const DownloadedSong = mongoose.model('DownloadedSong', downloadedSongSchema);
