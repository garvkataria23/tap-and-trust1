// MongoDB Service - Uses REST API backend at localhost:5000
// For local development with Express backend

const API_BASE = 'http://localhost:5000/api';

export const initializeRealm = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      console.log('✅ Backend service initialized successfully');
      return { ok: true };
    }
  } catch (error) {
    console.error('❌ Failed to connect to backend:', error);
  }
  return null;
};

export const getRealm = () => {
  return {
    api: {
      baseUrl: API_BASE
    }
  };
};

// Authentication Functions
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    console.log('✅ Registration successful');
    return data.user;
  } catch (error) {
    console.error('❌ Registration failed:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    console.log('✅ Login successful');
    return data.user;
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('❌ Logout failed:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : null;
};

// Database operations
export const saveUserProfile = async (userId: string, profileData: any) => {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    console.log('✅ Profile saved');
    return data.user;
  } catch (error) {
    console.error('❌ Failed to save profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`);
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('❌ Failed to get profile:', error);
    throw error;
  }
};

export const saveFriend = async (userId: string, friendData: any) => {
  try {
    const response = await fetch(`${API_BASE}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(friendData)
    });
    const data = await response.json();
    console.log('✅ Friend saved');
    return data.friend;
  } catch (error) {
    console.error('❌ Failed to save friend:', error);
    throw error;
  }
};

export const getFriends = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE}/friends/${userId}`);
    const data = await response.json();
    return data.friends || [];
  } catch (error) {
    console.error('❌ Failed to get friends:', error);
    throw error;
  }
};

export const saveGameResult = async (userId: string, gameData: any) => {
  try {
    const response = await fetch(`${API_BASE}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...gameData, userId })
    });
    const data = await response.json();
    console.log('✅ Game result saved');
    return data.gameResult;
  } catch (error) {
    console.error('❌ Failed to save game result:', error);
    throw error;
  }
};

export const saveMessage = async (userId: string, messageData: any) => {
  try {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...messageData, senderId: userId })
    });
    const data = await response.json();
    console.log('✅ Message saved');
    return data.message;
  } catch (error) {
    console.error('❌ Failed to save message:', error);
    throw error;
  }
};
