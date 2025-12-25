CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  sender TEXT CHECK(sender IN ('user', 'ai')),
  text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
