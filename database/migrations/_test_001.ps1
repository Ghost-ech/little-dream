# Script de test pour la migration 001
# Simule l'état de prod (sans team_members, sans colonnes donation),
# applique la migration, vérifie le résultat, puis nettoie.
#
# Usage : ./_test_001.ps1

$ErrorActionPreference = 'Stop'
$env:PGPASSWORD = 'Azerty@123'
$PSQL = 'psql -h localhost -U victor'
$TEST_DB = 'little_dream_migration_test'

Write-Host "`n=== 1. Création de la DB de test ===" -ForegroundColor Cyan
& cmd /c "$PSQL -d postgres -c `"DROP DATABASE IF EXISTS $TEST_DB;`""
& cmd /c "$PSQL -d postgres -c `"CREATE DATABASE $TEST_DB;`""

Write-Host "`n=== 2. Application du schéma 'pré-migration' (état prod) ===" -ForegroundColor Cyan
$preMigrationSql = @'
-- État de prod : pas de team_members, donations sans les 4 colonnes
CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(150) UNIQUE, password VARCHAR(255), role VARCHAR(20) DEFAULT 'admin', created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE activities (id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, description TEXT NOT NULL, category VARCHAR(100), image_url VARCHAR(500), status VARCHAR(20) DEFAULT 'active', created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
CREATE TABLE donations (id SERIAL PRIMARY KEY, donor_name VARCHAR(150), donor_email VARCHAR(150), amount DECIMAL(10,2) NOT NULL, currency VARCHAR(10) DEFAULT 'XAF', message TEXT, payment_status VARCHAR(30) DEFAULT 'pending', payment_reference VARCHAR(200), created_at TIMESTAMP DEFAULT NOW());

-- Insère un don pour vérifier que ALTER TABLE ne perd pas les données existantes
INSERT INTO donations (donor_name, amount) VALUES ('Test Donor', 5000);
'@
$preMigrationSql | & cmd /c "$PSQL -d $TEST_DB -v ON_ERROR_STOP=1"

Write-Host "`n=== 3. État AVANT migration ===" -ForegroundColor Cyan
& cmd /c "$PSQL -d $TEST_DB -c `"\dt`""
& cmd /c "$PSQL -d $TEST_DB -c `"\d donations`""

Write-Host "`n=== 4. Application de la migration ===" -ForegroundColor Cyan
& cmd /c "$PSQL -d $TEST_DB -v ON_ERROR_STOP=1 -f 001_add_team_members_and_donation_cols.sql"

Write-Host "`n=== 5. État APRÈS migration ===" -ForegroundColor Green
& cmd /c "$PSQL -d $TEST_DB -c `"\dt`""
Write-Host "`n--- structure team_members ---"
& cmd /c "$PSQL -d $TEST_DB -c `"\d team_members`""
Write-Host "`n--- structure donations (avec nouvelles colonnes) ---"
& cmd /c "$PSQL -d $TEST_DB -c `"\d donations`""
Write-Host "`n--- données donations préservées ? ---"
& cmd /c "$PSQL -d $TEST_DB -c `"SELECT id, donor_name, amount, payment_method FROM donations;`""

Write-Host "`n=== 6. Re-application (test idempotence) ===" -ForegroundColor Cyan
& cmd /c "$PSQL -d $TEST_DB -v ON_ERROR_STOP=1 -f 001_add_team_members_and_donation_cols.sql"
Write-Host "OK — pas d'erreur en rejouant"

Write-Host "`n=== 7. Nettoyage ===" -ForegroundColor Cyan
& cmd /c "$PSQL -d postgres -c `"DROP DATABASE $TEST_DB;`""

Write-Host "`n✅ TEST RÉUSSI" -ForegroundColor Green
