// In-memory mock database for development
// This allows the backend to run without MongoDB

const mockData = {
  users: [],
  friends: [],
  messages: [],
  games: [],
  shoutouts: [],
  friendRequests: [],
  achievements: [],
  leaderboards: [],
  onlineStatuses: [],
  connectorRatings: [],
  musicHistories: [],
  albums: [],
  playlists: [],
  musicRecommendations: [],
  downloadedSongs: []
};

// Simple ID generator
let idCounter = {};
const generateId = (collection) => {
  if (!idCounter[collection]) idCounter[collection] = 0;
  return String(++idCounter[collection]);
};

// Mock MongoDB connection
export const connectMockDatabase = async () => {
  console.log('✅ Mock Database Connected (In-Memory)');
  return true;
};

// Generic CRUD operations
export const create = (collection, data) => {
  const doc = { _id: generateId(collection), ...data, createdAt: new Date() };
  mockData[collection].push(doc);
  return doc;
};

export const findOne = (collection, query) => {
  return mockData[collection].find(doc => {
    for (const key in query) {
      if (doc[key] !== query[key]) return false;
    }
    return true;
  });
};

export const find = (collection, query = {}) => {
  return mockData[collection].filter(doc => {
    for (const key in query) {
      if (doc[key] !== query[key]) return false;
    }
    return true;
  });
};

export const findOneAndUpdate = (collection, query, update) => {
  const doc = findOne(collection, query);
  if (doc) {
    Object.assign(doc, update);
  }
  return doc;
};

export const findOneAndDelete = (collection, query) => {
  const index = mockData[collection].findIndex(doc => {
    for (const key in query) {
      if (doc[key] !== query[key]) return false;
    }
    return true;
  });
  if (index !== -1) {
    return mockData[collection].splice(index, 1)[0];
  }
  return null;
};

export const deleteMany = (collection, query) => {
  let count = 0;
  for (let i = mockData[collection].length - 1; i >= 0; i--) {
    const doc = mockData[collection][i];
    let match = true;
    for (const key in query) {
      if (doc[key] !== query[key]) {
        match = false;
        break;
      }
    }
    if (match) {
      mockData[collection].splice(i, 1);
      count++;
    }
  }
  return { deletedCount: count };
};

export const updateMany = (collection, query, update) => {
  let count = 0;
  mockData[collection].forEach(doc => {
    let match = true;
    for (const key in query) {
      if (doc[key] !== query[key]) {
        match = false;
        break;
      }
    }
    if (match) {
      Object.assign(doc, update);
      count++;
    }
  });
  return { modifiedCount: count };
};

export const countDocuments = (collection, query = {}) => {
  return find(collection, query).length;
};

export const getMockData = () => mockData;
