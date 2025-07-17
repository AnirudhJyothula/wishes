/*
  # Create feelings table for storing user responses

  1. New Tables
    - `feelings`
      - `id` (uuid, primary key)
      - `user_feelings` (text, the feelings/thoughts shared)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `feelings` table
    - Add policy for anyone to insert feelings (anonymous access)
    - Add policy for anyone to read their own feelings
*/

CREATE TABLE IF NOT EXISTS feelings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_feelings text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE feelings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feelings (for anonymous users)
CREATE POLICY "Anyone can insert feelings"
  ON feelings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read feelings (for this special use case)
CREATE POLICY "Anyone can read feelings"
  ON feelings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to update feelings (for real-time updates)
CREATE POLICY "Anyone can update feelings"
  ON feelings
  FOR UPDATE
  TO anon, authenticated
  USING (true);