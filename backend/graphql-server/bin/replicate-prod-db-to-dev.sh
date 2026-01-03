# `npm run db:replicate-prod-db-to-local` to back up produciton data into local DB.

# While it would ideal to run periodically at off-hours in a cron job, 
# that only works when your computer is powered on.
# In future, you can run this script periodically in a cron job by:
#   1. crontab -e  (this will open an editor to define the cron job)
#   2. Pasting the following command to run it daily at 2am:
#     0 2 * * * cd /Users/johnmckinnon/DATA_STORAGE/repos/kettlepal/backend/graphql-server && npx dotenv -e .env.local -- bash bin/replicate-prod-db-to-dev.sh >> /Users/johnmckinnon/DATA_STORAGE/repos/kettlepal/backend/cronLogs/db_replicate_$(date +\%Y-\%m-\%d).log 2>&1

#!/usr/bin/env bash
set -e

# Load env variables into shell
set -a
source .env
set +a

echo "🔄 Replicating Neon Prodcution DB → Local DB..."

# Safety check
if [[ -z "$NEON_PROD_CONNECTION_STRING" || -z "$KNEX_LOCAL_CONNECTION_STRING" ]]; then
  echo "❌ Missing DATABASE URLs"
  exit 1
fi

# Specifies the FROM - We are creating a dump of the PROD db.
echo "📦 Dumping Production DB..."
pg_dump \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  "$NEON_PROD_CONNECTION_STRING" > /tmp/prod_dump.sql

# Speciefies the TO - We are restoring prod DB into the LOCAL db.
echo "♻️ Restoring Production DB into Local..."
# DANGER - THE FOLLOWING LINE SPECIFIES WHICH DATABASE WILL BE 
#          COMPLETETLY OVERWRITTEN WITH DATA FROM PG_DUMP
#          --- NEVER SET THIS TO PRODUCTION! ---
psql "$KNEX_LOCAL_CONNECTION_STRING" < /tmp/prod_dump.sql

echo "✅ Local DB now matches Production DB."
