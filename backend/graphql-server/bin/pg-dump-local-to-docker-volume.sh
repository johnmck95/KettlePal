#!/usr/bin/env sh
set -e

echo "🔄 Backing up local DB to Docker volume..."

if [ -z "$KNEX_LOCAL_CONNECTION_STRING" ]; then
  echo "❌ KNEX_LOCAL_CONNECTION_STRING missing"
  exit 1
fi

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="/backup/local_dump_${TIMESTAMP}.sql"

echo "📦 Creating dump..."

pg_dump \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  "$KNEX_LOCAL_CONNECTION_STRING" > "$BACKUP_FILE"

echo "✅ Backup saved:"
echo "$BACKUP_FILE"