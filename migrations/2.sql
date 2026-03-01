
CREATE TABLE interest_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interest_tags_user_id ON interest_tags(user_id);
CREATE INDEX idx_interest_tags_tag ON interest_tags(tag);
