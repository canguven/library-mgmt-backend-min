-- Drop tables if they exist
DROP TABLE IF EXISTS "Borrows";
DROP TABLE IF EXISTS "Books";
DROP TABLE IF EXISTS "Users";

-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create Books table
CREATE TABLE IF NOT EXISTS "Books" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create Borrows table
CREATE TABLE IF NOT EXISTS "Borrows" (
  id SERIAL PRIMARY KEY,
  "borrowedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "returnedAt" TIMESTAMP WITH TIME ZONE,
  "userScore" INTEGER,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "UserId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  "BookId" INTEGER REFERENCES "Books"(id) ON DELETE CASCADE
);

-- Initial seed data - Users
INSERT INTO "Users" (id, name, "createdAt", "updatedAt") VALUES 
  (1, 'Eray Aslan', NOW(), NOW()),
  (2, 'Enes Faruk Meniz', NOW(), NOW()),
  (3, 'Sefa Eren Şahin', NOW(), NOW()),
  (4, 'Kadir Mutlu', NOW(), NOW());

-- Books seed data
INSERT INTO "Books" (id, name, "createdAt", "updatedAt") VALUES 
  (1, 'The Hitchhiker''s Guide to the Galaxy', NOW(), NOW()),
  (2, 'I, Robot', NOW(), NOW()),
  (3, 'Dune', NOW(), NOW()),
  (4, '1984', NOW(), NOW()),
  (5, 'Brave New World', NOW(), NOW());

-- Sample borrows
INSERT INTO "Borrows" ("UserId", "BookId", "borrowedAt", "returnedAt", "userScore", "createdAt", "updatedAt") VALUES 
  (1, 2, NOW() - INTERVAL '90 days', NOW() - INTERVAL '80 days', 5, NOW(), NOW()),
  (3, 2, NOW() - INTERVAL '75 days', NOW() - INTERVAL '65 days', 6, NOW(), NOW()),
  (2, 1, NOW() - INTERVAL '30 days', NOW() - INTERVAL '20 days', 10, NOW(), NOW()),
  (2, 2, NOW() - INTERVAL '60 days', NOW() - INTERVAL '50 days', 5, NOW(), NOW()),
  (2, 5, NOW() - INTERVAL '10 days', NULL, NULL, NOW(), NOW());