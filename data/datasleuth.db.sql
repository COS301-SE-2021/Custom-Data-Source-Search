BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "folder_data" (
	"folder_name"	TEXT NOT NULL,
	"path"	TEXT NOT NULL UNIQUE,
	"uuid"	TEXT NOT NULL UNIQUE,
	"tag1"	TEXT,
	"tag2"	TEXT,
	"dot_ignore"	TEXT NOT NULL,
	PRIMARY KEY("uuid")
);
CREATE TABLE IF NOT EXISTS "folder_file_data" (
	"filename"	TEXT NOT NULL,
	"path"	TEXT NOT NULL,
	"last_modified"	NUMERIC NOT NULL,
	"folder_uuid"	TEXT NOT NULL UNIQUE,
	"uuid"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("uuid"),
	FOREIGN KEY("folder_uuid") REFERENCES "folder_data"("uuid")
);
CREATE TABLE IF NOT EXISTS "pending_user" (
	"email"	TEXT NOT NULL UNIQUE,
	"single_use_refresh_token"	TEXT NOT NULL,
	FOREIGN KEY("email") REFERENCES "user"("email"),
	PRIMARY KEY("email")
);
CREATE TABLE IF NOT EXISTS "active_user" (
	"email"	TEXT NOT NULL UNIQUE,
	"refresh_token"	TEXT NOT NULL UNIQUE,
	"valid_until"	TEXT NOT NULL,
	FOREIGN KEY("email") REFERENCES "user"("email"),
	PRIMARY KEY("refresh_token")
);
CREATE TABLE IF NOT EXISTS "user" (
	"first_name"	TEXT NOT NULL,
	"last_name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"id"	INTEGER NOT NULL UNIQUE,
	"hashed_key"	TEXT,
	"access_level"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "file_data" (
	"uuid"	TEXT NOT NULL UNIQUE,
	"file_path"	TEXT NOT NULL UNIQUE,
	"last_modified"	NUMERIC NOT NULL,
	"tag1"	TEXT,
	"tag2"	TEXT,
	PRIMARY KEY("uuid")
);
COMMIT;
