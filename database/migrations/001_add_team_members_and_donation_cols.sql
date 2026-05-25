-- Migration 001 — 2026-05-25
-- Ajoute la table team_members (manquante en prod) + les 4 colonnes
-- de paiement ajoutées au model Donation.
--
-- Idempotent : peut être rejoué sans erreur, ne touche pas aux données existantes.
-- Appliqué par : psql -d little_dream -f 001_add_team_members_and_donation_cols.sql

BEGIN;

-- ─── 1. Table team_members ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  position      VARCHAR(150) NOT NULL,
  bio           TEXT,
  image_url     VARCHAR(500),
  email         VARCHAR(150),
  linkedin_url  VARCHAR(500),
  twitter_url   VARCHAR(500),
  facebook_url  VARCHAR(500),
  display_order INT     DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ─── 2. Colonnes paiement sur donations ────────────────────────────
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30) DEFAULT 'cash';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS phone_number   VARCHAR(30);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(200);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS operator       VARCHAR(50);

COMMIT;
