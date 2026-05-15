#!/usr/bin/env sh
set -e

echo "♻️ Restoring backup from Docker volume..."

# Wait for Postgres to be ready
until psql "$KNEX_LOCAL_CONNECTION_STRING" -c "SELECT 1" > /dev/null 2>&1; do
  echo "⏳ Waiting for Postgres..."
  sleep 2
done

LATEST_BACKUP=$(ls -t /backup/local_dump_*.sql 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "⚠️ No backup file found in /backup/"
  exit 0
fi

echo "📥 Restoring from: $LATEST_BACKUP"

psql "$KNEX_LOCAL_CONNECTION_STRING" < "$LATEST_BACKUP"

echo "✅ Restore complete."
