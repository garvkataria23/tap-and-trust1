# MongoDB Atlas + Realm Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Create account with email/password
4. Verify email

## Step 2: Create a Free Cluster
1. After login, click "Create" → "Build a Database"
2. Choose **M0 (Free)** tier
3. Select region closest to you (e.g., **Asia Pacific: Mumbai** for India)
4. Click "Create Cluster" (takes 2-3 minutes)

## Step 3: Setup Email/Password Authentication
1. Go to **Manage** → **Authentication Providers**
2. Click **Email/Password**
3. Toggle **Enable the Email/Password Authentication** ON
4. Choose **Automatically confirm users** (for dev)
5. Click **Save**

## Step 4: Get Your Realm App ID
1. Go to **Manage** → **Apps**
2. Click **Create a New App**
3. Name it: `tapandtrust` (or any name)
4. Click **Create**
5. Copy the **App ID** (looks like: `tapandtrust-abcde`)

## Step 5: Update Code with App ID
1. Open: `src/shared/mongoDbService.ts`
2. Replace this line:
   ```typescript
   const REALM_APP_ID = 'YOUR_REALM_APP_ID_HERE';
   ```
   With your actual App ID:
   ```typescript
   const REALM_APP_ID = 'tapandtrust-abcde';
   ```

## Step 6: Enable MongoDB Data API
1. Go to **Data API** in your Realm App
2. Click **Enable Data API**
3. Copy the API URL (you'll use this for backend later)

## Step 7: Create Database Rules
1. Go to **Database** → **Collections**
2. Click **Create Collection**
3. Database: `tapandtrust`
4. Collection names (create these):
   - `users` - Store user profiles
   - `friends` - Store friend connections
   - `messages` - Store chat messages
   - `games` - Store game scores
   - `shoutouts` - Store user posts

5. For each collection:
   - Go to **Rules** tab
   - Set permission to **Users can read and write their own data**
   - OR use custom rules below

### Custom Rule (Optional):
```json
{
  "roles": [
    {
      "name": "default",
      "apply_when": {},
      "document_filters": {
        "read": true,
        "write": { "userId": "%%user.id" }
      },
      "insert": true,
      "delete": { "userId": "%%user.id" },
      "search": true
    }
  ]
}
```

## Step 8: Test Everything
1. Save the file with your App ID
2. Run: `npm run dev`
3. Go to http://localhost:5173
4. Click "Sign Up"
5. Create account with:
   - Email: test@example.com
   - Password: Test123456 (min 6 chars)
   - Name: Your Name
6. Should redirect to Dashboard ✅

## Troubleshooting

### "Realm not initialized" error
- Make sure `REALM_APP_ID` is set correctly
- Check internet connection

### "User already exists" error
- Delete user from MongoDB Realm console
- Or use different email

### "Invalid credentials" error
- Check password is at least 6 characters
- Email must match while signing up

---

## What's Happening Behind the Scenes

- **Email/Password Auth**: Realm handles user validation
- **MongoDB Atlas**: Stores actual data (users, friends, messages, etc.)
- **Realm Web SDK**: Connects frontend directly to MongoDB (no backend server needed)
- **localStorage**: Caches user info locally

## Data Storage

Once authenticated, all data saved to MongoDB:
- User profiles (name, email, avatar, mood, interests)
- Friends list (friend info, category, expiry date)
- Messages (chat history)
- Game scores (who won, points, date)
- Shoutouts (posts from Dashboard)

## Next Steps

1. ✅ Sign up works
2. ✅ Games visible  
3. ✅ Profile edits save to MongoDB
4. ✅ Friends list syncs
5. ✅ Messages stored

---

**Questions?** Let me know if you hit any errors!
