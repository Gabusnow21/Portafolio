#!/bin/bash
# deploy/backup-db.sh — Backup diario de PostgreSQL (portfolio)
# Cron: 0 3 * * * /home/homelab/pruebas/Portafolio/deploy/backup-db.sh

set -euo pipefail

BACKUP_DIR="/backups/portfolio"
CONTAINER="portfolio_db"
DB_USER="${POSTGRES_USER:-portfolio_user}"
DB_NAME="${POSTGRES_DB:-portfolio_db}"

mkdir -p "$BACKUP_DIR"

docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > \
  "$BACKUP_DIR/portfolio_db_$(date +%Y%m%d_%H%M%S).sql.gz"

find "$BACKUP_DIR" -name "portfolio_db_*.sql.gz" -mtime +7 -delete

echo "[$(date)] Backup completado: $BACKUP_DIR"
