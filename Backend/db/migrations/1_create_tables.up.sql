CREATE TABLE IF NOT EXISTS "courses" (
    "id" SERIAL PRIMARY KEY,
    "sid" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "term" VARCHAR(255) NOT NULL,
    "highest" BOOLEAN,
    "schemas" JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS "schools" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "alias" TEXT
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255),
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "status" (
    "id" SERIAL PRIMARY KEY,
    "status" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "enrolled" (
    "uid" INTEGER NOT NULL,
    "cid" INTEGER NOT NULL,
    PRIMARY KEY ("uid", "cid"),
    FOREIGN KEY ("uid") REFERENCES "users"("id"),
    FOREIGN KEY ("cid") REFERENCES "courses"("id")
);

CREATE TABLE IF NOT EXISTS "attends" (
    "uid" INTEGER NOT NULL,
    "sid" INTEGER NOT NULL,
    PRIMARY KEY ("uid", "sid"),
    FOREIGN KEY ("uid") REFERENCES "users"("id"),
    FOREIGN KEY ("sid") REFERENCES "schools"("id")
);

CREATE TABLE IF NOT EXISTS "assignments" (
    "id" SERIAL PRIMARY KEY,
    "cid" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "points" REAL NOT NULL,
    "start" TIMESTAMP,
    "end" TIMESTAMP,
    FOREIGN KEY ("cid") REFERENCES "courses"("id")
);

CREATE TABLE IF NOT EXISTS "student_assignment" (
    "uid" INTEGER NOT NULL,
    "aid" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "score" REAL,
    PRIMARY KEY ("uid", "aid"),
    FOREIGN KEY ("uid") REFERENCES "users"("id"),
    FOREIGN KEY ("aid") REFERENCES "assignments"("id"),
    FOREIGN KEY ("status_id") REFERENCES "status"("id")
);

CREATE TABLE IF NOT EXISTS "verification_codes" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL
);
