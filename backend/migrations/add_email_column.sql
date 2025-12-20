-- Migration: Add email column to users table
-- Date: 2025-01-20
-- Description: Add email column to support Google OAuth login

-- Add email column if it doesn't exist
ALTER TABLE users ADD COLUMN email TEXT;

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
