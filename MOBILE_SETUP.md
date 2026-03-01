# 📱 Tap & Trust - Mobile App Setup Guide

## Overview

We've created a **mobile-first, native app** using React Native and Expo. This is a complete mobile application that works on both iOS and Android, separate from the web version.

## ✅ What's Been Set Up

### 1. **Profile Page with Photo Upload** ✓
   - Location: `src/react-app/pages/Profile.tsx`
   - Added full photo upload functionality
   - Camera icon overlay for easy upload
   - Displays custom profile photos
   - Saves photos to local state (ready for backend)

### 2. **Mobile App Structure** ✓
   - Location: `mobile/` folder
   - Complete React Native/Expo setup
   - Profile setup screen with:
     - ✓ Photo upload from gallery
     - ✓ Photo capture from camera
     - ✓ Profile name input
     - ✓ Bio input
     - ✓ Mood tag selection
     - ✓ Save functionality

## 🚀 Getting Started with Mobile

### Step 1: Install Expo CLI
```bash
npm install -g expo-cli
```

### Step 2: Navigate to Mobile Directory
```bash
cd mobile
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Development

**Option A: On Physical Device**
```bash
npm start
# Scan QR code with:
# - iPhone: Camera app
# - Android: Expo Go app (install from Play Store)
```

**Option B: On iOS Simulator (Mac only)**
```bash
npm run ios
```

**Option C: On Android Emulator**
```bash
npm run android
```

**Option D: Web Version (Testing)**
```bash
npm run web
```

## 📁 Mobile App Structure

```
mobile/
├── App.tsx                  # Main profile setup screen
├── app.json                 # Expo configuration
├── package.json            # React Native dependencies
├── babel.config.js         # Babel setup
├── tsconfig.json           # TypeScript configuration
├── README.md               # Mobile app README
└── assets/                 # Icons, splash screens (to create)
```

## 📱 Features in Mobile App

### Profile Setup Screen
- 📷 **Photo Upload**: Pick from gallery or take new photo
- 👤 **Display Name**: Custom name input
- 💬 **Bio**: Personal bio text
- 😎 **Mood Tags**: 4 mood options (Chill, Collaborate, Browsing, Open to Talk)
- 💾 **Save Profile**: One-tap save to backend

### Permissions Required
- ✅ Camera: For taking profile photos
- ✅ Photo Library: For selecting profile photos
- ✅ Location: For discovering friends nearby (in future)

## 🔗 Connecting Web & Mobile

Both apps use the same API backend:
- Web: `http://localhost:5173`
- Mobile: Replace API calls with your backend URL in `App.tsx`

## 🎨 UI/UX Highlights

- ✨ Dark theme optimized for mobile
- 📱 Full-screen, gesture-friendly interface
- ⚡ Fast image compression
- 🎭 Smooth transitions and animations
- ♿ Touch-friendly button sizes

## 📝 Next Steps

1. **Create Assets** (optional but recommended):
   - App icon (192x192 or larger)
   - Splash screen
   - Adaptive icon for Android

2. **Update Backend URL**:
   In `mobile/App.tsx`, replace `/api/profile` with your actual backend URL

3. **Add More Screens**:
   - Scanner (QR code)
   - Dashboard
   - Discover
   - Friends
   - Chat

4. **Build for Distribution**:
   ```bash
   npm install -g eas-cli
   eas build --platform ios
   eas build --platform android
   ```

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -i :8081  # Check what's using port 8081
kill -9 <PID>  # Kill the process
```

### Module Not Found
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --clear
```

### Camera Permission Denied
- For iOS: Check Settings > Tap & Trust > Camera
- For Android: Check Settings > Apps > Tap & Trust > Permissions

### Image Not Uploading
- Check file size (max 5MB)
- Verify file format (PNG, JPG, GIF)
- Check network connectivity

## 📚 Learning Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)

## 🔐 Security Notes

- Never commit API keys to git
- Use `.env` file for sensitive data
- Always validate file uploads on backend
- Implement proper authentication
- Use HTTPS for API calls

## 📊 Project Structure (Web vs Mobile)

```
Web:
├── src/react-app/
│   ├── pages/
│   │   └── Profile.tsx (Enhanced with photo upload)
│   └── ...

Mobile:
└── mobile/
    ├── App.tsx (Profile setup with Expo)
    └── ...
```

## ✨ Summary

You now have:
1. ✅ Enhanced web Profile page with photo upload
2. ✅ Complete React Native/Expo mobile app setup
3. ✅ Mobile profile setup screen with all features
4. ✅ Both apps ready for further development

Start with: `cd mobile && npm install && npm start`

Happy coding! 🚀
