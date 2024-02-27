DROP TABLE IF EXISTS conversations;

CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    group_id TEXT,
    user_message TEXT NOT NULL,
    bot_message TEXT
);

DROP TABLE IF EXISTS lang_settings;

CREATE TABLE personalise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_o_group_id TEXT UNIQUE NOT NULL,
    talk_lang TEXT,
    output_style TEXT
);