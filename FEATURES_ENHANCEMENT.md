# Tap & Trust - Music History & Diary Enhancement Features

## Overview
This document outlines the new features added to the Tap & Trust app:
- **Feature 23**: User-Created Music Albums
- **Feature 24**: Diary Statistics & Analytics

---

## Feature 23: User-Created Music Albums

### What's New?
Users can now create custom music albums to organize their favorite songs and share them with others.

### Backend Models & Database
**New Schema: Album**
```javascript
{
  userId: String,              // Album owner
  name: String,                // Album title
  description: String,         // Album description
  coverImage: String,          // Album cover URL
  isPublic: Boolean,           // Public/private visibility
  songs: [
    {
      musicHistoryId: String,  // Reference to song
      title: String,
      artist: String,
      duration: Number,
      imageUrl: String,
      addedAt: Date
    }
  ],
  likes: Number,               // Like counter
  likedBy: [String],           // Users who liked it
  totalDuration: Number,       // Total duration of all songs
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Create Album
```
POST /api/albums
Body: {
  userId: String,
  name: String,
  description?: String,
  coverImage?: String,
  isPublic?: Boolean
}
```

#### Get User's Albums
```
GET /api/albums/:userId
Response: { albums: Album[] }
```

#### Get Album Details
```
GET /api/albums/:albumId/details
Response: { album: Album }
```

#### Update Album
```
PUT /api/albums/:albumId
Body: {
  name?: String,
  description?: String,
  coverImage?: String,
  isPublic?: Boolean
}
```

#### Delete Album
```
DELETE /api/albums/:albumId
```

#### Add Song to Album
```
POST /api/albums/:albumId/songs
Body: {
  musicHistoryId: String,
  title: String,
  artist: String,
  duration: Number,
  imageUrl: String
}
```

#### Remove Song from Album
```
DELETE /api/albums/:albumId/songs/:songIndex
```

#### Like Album
```
POST /api/albums/:albumId/like
Body: { userId: String }
```

#### Unlike Album
```
POST /api/albums/:albumId/unlike
Body: { userId: String }
```

### Frontend Components
**New Component: AlbumManager.tsx**
- Create new albums with name, description, and cover image
- View all user albums in a responsive grid
- Edit album details
- Delete albums
- Like/unlike albums
- Add songs to albums (from music history)
- Remove songs from albums
- Toggle between public/private visibility

**Location**: `/api/albums/`
**UI Features**:
- Album creation dialog with form validation
- Album grid view with album info cards
- Like button with heart icon
- Edit and delete buttons with hover effects
- Song counter and duration display
- Public/private badge indicator

### How to Use
1. Go to **Music** page
2. Click on **My Albums** tab
3. Click **New Album** button
4. Fill in album details (name, description, cover image)
5. Toggle public/private setting
6. Click **Create Album**
7. View, edit, or delete albums in the grid
8. Add songs from music history to your albums
9. Like albums and see stats

---

## Feature 24: Diary Statistics & Analytics

### What's New?
Users can now view detailed statistics and insights about their diary entries, including mood distribution, streaks, and writing patterns.

### Backend Models & Database
**New Schema: DiaryStats**
```javascript
{
  userId: String (unique),
  totalEntries: Number,
  moodDistribution: {
    happy: Number,
    sad: Number,
    excited: Number,
    anxious: Number,
    calm: Number,
    inspired: Number,
    grateful: Number,
    reflective: Number
  },
  mostFrequentMood: String,
  averageWordsPerEntry: Number,
  lastEntryDate: Date,
  streakDays: Number,
  longestStreak: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Get Diary Statistics
```
GET /api/diary/:userId/stats
Response: {
  stats: {
    totalEntries: Number,
    moodDistribution: Object,
    mostFrequentMood: String,
    averageWordsPerEntry: Number,
    lastEntryDate: Date,
    streakDays: Number,
    longestStreak: Number
  }
}
```

#### Get Entries Grouped by Mood
```
GET /api/diary/:userId/by-mood
Response: {
  groupedByMood: {
    "mood1": [DiaryEntry[], ...],
    "mood2": [DiaryEntry[], ...],
    ...
  }
}
```

### Frontend Components

**New Component: DiaryStats.tsx**
Displays comprehensive diary analytics:
- **Total Entries**: Number of diary entries written
- **Average Words Per Entry**: Writing productivity metric
- **Current Streak**: Days of consecutive diary entries
- **Longest Streak**: Best writing streak record
- **Mood Distribution**: Visual bar chart of mood usage
- **Most Frequent Mood**: Highlighted dominant mood with emoji
- **Last Entry Date**: When the last entry was written

**New Component: DiaryFilter.tsx**
Filter diary entries by mood:
- Click mood emojis to filter entries
- Multi-select support for multiple moods
- Clear filters button
- Real-time filtering

### Frontend Integration
**Updated Page: Diary.tsx**
- Two-column layout on desktop (responsive)
- Stats sidebar on the left showing analytics
- Diary entries and creation on the right
- Integrated mood filtering

### Statistics Displayed
1. **Mood Distribution** (Visual Bar Chart)
   - Shows percentage breakdown of each mood
   - Color-coded progress bars
   - Emoji indicators for each mood

2. **Mood Tracking**
   - Most frequent mood highlighted
   - Count of entries for each mood
   - Mood emojis for visual reference

3. **Writing Habits**
   - Average words per entry
   - Total number of entries
   - Last entry timestamp

4. **Streaks**
   - Current consecutive writing days
   - Longest streak record
   - Encouragement message

### How to Use
1. Go to **Diary** page
2. View **Diary Insights** panel on the left
3. See your statistics:
   - Total entries
   - Average words per entry
   - Current and longest streaks
   - Mood distribution graph
4. Filter by mood:
   - Click mood emoji buttons to filter entries
   - Click multiple moods to multi-filter
   - Click **Clear Filters** to reset
5. See filtered entries on the right panel

---

## Data Flow Architecture

### Music Albums
```
User → MusicHistory entries → Album Creation → AlbumManager
    ↓
Songs stored in Album
    ↓
Like/Unlike interactions
    ↓
API updates database
```

### Diary Statistics
```
DiaryEntry → DiaryStats API endpoints → DiaryStats component
    ↓
Real-time calculation of:
- Mood distribution
- Writing streaks
- Average metrics
    ↓
Displayed in stats dashboard
```

---

## Database Schema Updates

### New Collections
1. **albums** - User-created music albums
2. **diarystats** - Analytics for each user

### Updated Models
- **models.js**: Added Album and DiaryStats schemas
- **server.js**: Added 13+ new API endpoints

---

## Frontend Architecture

### New Components
1. `AlbumManager.tsx` - Album creation and management
2. `DiaryStats.tsx` - Statistics dashboard
3. `DiaryFilter.tsx` - Mood-based filtering

### Updated Components
1. `Music.tsx` - Added tabs for History/Albums
2. `Diary.tsx` - Added stats sidebar

### Component Imports
All components properly import UI components from shadcn/ui:
- Button, Input, Textarea, Dialog
- Badge, etc.

---

## Styling & Theme Integration

Both new features follow the app's design system:
- **Albums**: Indigo theme (matches Music page)
  - Indigo gradients and borders
  - Indigo accent colors
  - Indigo shadow effects

- **Diary Stats**: Rose theme (matches Diary page)
  - Rose gradients and borders
  - Rose accent colors
  - Rose shadow effects

---

## API Summary

### Total New Endpoints: 13+
**Album Endpoints: 8**
- POST /api/albums - Create
- GET /api/albums/:userId - Get user albums
- GET /api/albums/:albumId/details - Get album
- PUT /api/albums/:albumId - Update
- DELETE /api/albums/:albumId - Delete
- POST /api/albums/:albumId/songs - Add song
- DELETE /api/albums/:albumId/songs/:songIndex - Remove song
- POST /api/albums/:albumId/like - Like album
- POST /api/albums/:albumId/unlike - Unlike album

**Diary Endpoints: 2+**
- GET /api/diary/:userId/stats - Get statistics
- GET /api/diary/:userId/by-mood - Get entries by mood

---

## Feature Highlights

### Albums
✅ Create unlimited custom albums
✅ Add multiple songs per album
✅ Custom cover images
✅ Public/private visibility
✅ Like/unlike functionality
✅ Total duration tracking
✅ Edit and delete albums
✅ Responsive grid layout

### Diary Stats
✅ Real-time statistics calculation
✅ Mood distribution visualization
✅ Streak tracking (current & longest)
✅ Writing habit analytics
✅ Mood-based filtering
✅ Responsive sidebar layout
✅ Beautiful emoji indicators
✅ Last entry tracking

---

## Testing Checklist

### Functionality Tests
- [ ] Create album with all fields
- [ ] Create album with minimal fields
- [ ] Edit album details
- [ ] Delete album
- [ ] Add song to album
- [ ] Remove song from album
- [ ] Like/unlike album
- [ ] Toggle album public/private
- [ ] View diary statistics
- [ ] Filter entries by mood
- [ ] Filter multiple moods at once
- [ ] Clear filters

### UI/UX Tests
- [ ] Responsive design on mobile/tablet
- [ ] Proper color theming (indigo for music, rose for diary)
- [ ] Smooth transitions and hover effects
- [ ] Dialog modals open/close properly
- [ ] Icons display correctly
- [ ] Text truncation works for long names

### API Tests
- [ ] Album endpoints return correct data
- [ ] Diary stats calculated accurately
- [ ] Database updates properly
- [ ] Error handling for invalid inputs

---

## Total Features Now: 24/24
1. Online Status & Last Seen ✅
2. Message Read Receipts ✅
3. Message Reactions ✅
4. Voice Notes ✅
5. Game Statistics ✅
6. Emoji Picker ✅
7. Message Features (edit/delete/pin) ✅
8. Voice Messages ✅
9. Friend Requests System ✅
10. User Discovery ✅
11. User Blocking ✅
12. Achievements & Badges ✅
13. Friend Streaks ✅
14. Notifications Settings ✅
15. Chat Organization ✅
16. Privacy Settings ✅
17. Chat Themes ✅
18. Night Mode/Auto Theme ✅
19. Game Leaderboard ✅
20. Connector Ratings ✅
21. Music History ✅
22. Creative Diary ✅
23. User-Created Albums ✅ **NEW**
24. Diary Statistics & Analytics ✅ **NEW**

---

## Version: 2.0.0
- Enhanced Music History with Album Management
- Enhanced Creative Diary with Statistics & Analytics
- 13+ New API Endpoints
- 3 New React Components
- Improved Data Analytics Infrastructure
