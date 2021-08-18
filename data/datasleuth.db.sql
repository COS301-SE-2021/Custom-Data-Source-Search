BEGIN TRANSACTION;
DROP TABLE IF EXISTS "folder_data";
CREATE TABLE IF NOT EXISTS "folder_data" (
	"folder_name"	TEXT NOT NULL,
	"path"	TEXT NOT NULL UNIQUE,
	"uuid"	TEXT NOT NULL UNIQUE,
	"tag1"	TEXT,
	"tag2"	TEXT,
	"dot_ignore"	TEXT NOT NULL,
	PRIMARY KEY("uuid")
);
DROP TABLE IF EXISTS "folder_file_data";
CREATE TABLE IF NOT EXISTS "folder_file_data" (
	"filename"	TEXT NOT NULL,
	"path"	TEXT NOT NULL,
	"last_modified"	NUMERIC NOT NULL,
	"folder_uuid"	TEXT NOT NULL UNIQUE,
	"uuid"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("uuid"),
	FOREIGN KEY("folder_uuid") REFERENCES "folder_data"("uuid")
);
DROP TABLE IF EXISTS "active_user";
CREATE TABLE IF NOT EXISTS "active_user" (
	"email"	TEXT NOT NULL UNIQUE,
	"refresh_token"	TEXT NOT NULL UNIQUE,
	"valid_until"	TEXT NOT NULL,
	PRIMARY KEY("refresh_token"),
	FOREIGN KEY("email") REFERENCES "user"("email")
);
DROP TABLE IF EXISTS "file_data";
CREATE TABLE IF NOT EXISTS "file_data" (
	"uuid"	TEXT NOT NULL UNIQUE,
	"file_path"	TEXT NOT NULL UNIQUE,
	"last_modified"	NUMERIC NOT NULL,
	"tag1"	TEXT,
	"tag2"	TEXT,
	PRIMARY KEY("uuid")
);
DROP TABLE IF EXISTS "user";
CREATE TABLE IF NOT EXISTS "user" (
	"first_name"	TEXT NOT NULL,
	"last_name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"id"	INTEGER NOT NULL UNIQUE,
	"password_hash"	TEXT,
	"role"	TEXT NOT NULL DEFAULT 0,
	"otp_seed"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "pending_user";
CREATE TABLE IF NOT EXISTS "pending_user" (
	"email"	TEXT NOT NULL UNIQUE,
	"single_use_registration_token"	TEXT NOT NULL,
	"secret"	TEXT,
	PRIMARY KEY("email"),
	FOREIGN KEY("email") REFERENCES "user"("email")
);
DROP TABLE IF EXISTS "webpage_data";
CREATE TABLE IF NOT EXISTS "webpage_data" (
	"uuid"	TEXT NOT NULL UNIQUE,
	"url"	TEXT NOT NULL,
	"tag1"	TEXT,
	"tag2"	TEXT,
	PRIMARY KEY("uuid")
);
COMMIT;
