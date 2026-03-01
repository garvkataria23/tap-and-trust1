
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  mood_tag TEXT DEFAULT 'Open to Talk',
  qr_code TEXT,
  latitude REAL,
  longitude REAL,
  is_location_visible BOOLEAN DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_active_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_location ON profiles(latitude, longitude);
