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
CREATE TABLE IF NOT EXISTS "active_user" (
	"email"	TEXT NOT NULL UNIQUE,
	"refresh_token"	TEXT NOT NULL UNIQUE,
	"valid_until"	TEXT NOT NULL,
	FOREIGN KEY("email") REFERENCES "user"("email"),
	PRIMARY KEY("refresh_token")
);
CREATE TABLE IF NOT EXISTS "file_data" (
	"uuid"	TEXT NOT NULL UNIQUE,
	"file_path"	TEXT NOT NULL UNIQUE,
	"last_modified"	NUMERIC NOT NULL,
	"tag1"	TEXT,
	"tag2"	TEXT,
	PRIMARY KEY("uuid")
);
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
CREATE TABLE IF NOT EXISTS "pending_user" (
	"email"	TEXT NOT NULL UNIQUE,
	"single_use_registration_token"	TEXT NOT NULL,
	"secret"	TEXT,
	FOREIGN KEY("email") REFERENCES "user"("email"),
	PRIMARY KEY("email")
);
CREATE TABLE IF NOT EXISTS "webpage_data" (
	"uuid"	TEXT NOT NULL UNIQUE,
	"url"	TEXT NOT NULL,
	"tag1"	TEXT,
	"tag2"	TEXT,
	PRIMARY KEY("uuid")
);
CREATE TABLE IF NOT EXISTS "folder_file_data" (
	"file_path"	TEXT NOT NULL,
	"last_modified"	NUMERIC NOT NULL,
	"folder_uuid"	TEXT NOT NULL,
	"uuid"	TEXT NOT NULL UNIQUE,
	FOREIGN KEY("folder_uuid") REFERENCES "folder_data"("uuid"),
	PRIMARY KEY("uuid")
);
CREATE TABLE IF NOT EXISTS "github_data" (
	"repo"	TEXT NOT NULL UNIQUE,
	"uuid"	TEXT NOT NULL UNIQUE,
	"tag1"	TEXT,
	"tag2"	TEXT,
	"token"	TEXT,
	PRIMARY KEY("uuid")
);
CREATE TABLE IF NOT EXISTS "repo_file_data" (
	"file_path"	TEXT NOT NULL UNIQUE,
	"repo_uuid"	TEXT,
	"uuid"	TEXT NOT NULL UNIQUE,
	FOREIGN KEY("repo_uuid") REFERENCES "github_data"("uuid"),
	PRIMARY KEY("uuid")
);
COMMIT;
