// MongoDB API Service
// This connects to the backend API which stores data in MongoDB Atlas

const API_URL = 'http://localhost:5000/api';

// ==================== USER API ====================

export const saveUserProfile = async (userData: {
  email: string;
  name: string;
  picture?: string;
  mood?: string;
  bio?: string;
  interests?: string[];
  qrCode?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to save profile');
    return await response.json();
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const getUserProfile = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${email}`);
    if (!response.ok) throw new Error('Failed to get profile');
    return await response.json();
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

// ==================== FRIENDS API ====================

export const saveFriend = async (friendData: {
  userId: string;
  friendId: string;
  category?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(friendData),
    });
    if (!response.ok) throw new Error('Failed to save friend');
    return await response.json();
  } catch (error) {
    console.error('Error saving friend:', error);
    throw error;
  }
};

export const getFriends = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/friends/${userId}`);
    if (!response.ok) throw new Error('Failed to get friends');
    return await response.json();
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
};

export const extendFriendConnection = async (friendId: string) => {
  try {
    const response = await fetch(`${API_URL}/friends/${friendId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to extend connection');
    return await response.json();
  } catch (error) {
    console.error('Error extending connection:', error);
    throw error;
  }
};

// ==================== MESSAGES API ====================

export const saveMessage = async (messageData: {
  senderId: string;
  receiverId: string;
  content: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) throw new Error('Failed to save message');
    return await response.json();
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const getMessages = async (userId: string, friendId: string) => {
  try {
    const response = await fetch(`${API_URL}/messages/${userId}/${friendId}`);
    if (!response.ok) throw new Error('Failed to get messages');
    return await response.json();
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// ==================== GAMES API ====================

export const saveGameResult = async (gameData: {
  userId: string;
  gameType: string;
  score?: number;
  opponent?: string;
  result?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });
    if (!response.ok) throw new Error('Failed to save game result');
    return await response.json();
  } catch (error) {
    console.error('Error saving game result:', error);
    throw error;
  }
};

export const getGameResults = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/games/${userId}`);
    if (!response.ok) throw new Error('Failed to get game results');
    return await response.json();
  } catch (error) {
    console.error('Error getting game results:', error);
    throw error;
  }
};

// ==================== SHOUTOUTS API ====================

export const createShoutout = async (shoutoutData: {
  userId: string;
  content: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/shoutouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shoutoutData),
    });
    if (!response.ok) throw new Error('Failed to create shoutout');
    return await response.json();
  } catch (error) {
    console.error('Error creating shoutout:', error);
    throw error;
  }
};

export const getAllShoutouts = async () => {
  try {
    const response = await fetch(`${API_URL}/shoutouts`);
    if (!response.ok) throw new Error('Failed to get shoutouts');
    return await response.json();
  } catch (error) {
    console.error('Error getting shoutouts:', error);
    throw error;
  }
};

export const getUserShoutouts = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/shoutouts/${userId}`);
    if (!response.ok) throw new Error('Failed to get user shoutouts');
    return await response.json();
  } catch (error) {
    console.error('Error getting user shoutouts:', error);
    throw error;
  }
};

export const likeShoutout = async (shoutoutId: string) => {
  try {
    const response = await fetch(`${API_URL}/shoutouts/${shoutoutId}/like`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to like shoutout');
    return await response.json();
  } catch (error) {
    console.error('Error liking shoutout:', error);
    throw error;
  }
};

// Health Check
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.warn('Backend not reachable:', error);
    return { success: false };
  }
};
