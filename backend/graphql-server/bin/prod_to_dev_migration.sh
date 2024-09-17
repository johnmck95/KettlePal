#!/bin/bash

# Configuration
set -a
source .env
set +a

# PROD_CONNECTION_STRING=process.env.NEON_PROD_CONNECTION_STRING
LOCAL_DB_NAME="kettlepal-dev"

# echo $NEON_PROD_CONNECTION_STRING

# Dump data from production database
echo "Dumping data from production database..."
pg_dump "$NEON_PROD_CONNECTION_STRING" > prod_backup.sql

# Drop existing local database
echo "Dropping existing local database..."
psql -d postgres -c "DROP DATABASE IF EXISTS \"$LOCAL_DB_NAME\""

# Create a new local database
echo "Creating new local database..."
psql -d postgres -c "CREATE DATABASE \"$LOCAL_DB_NAME\""

# Restore backup to local database, skipping errors
echo "Restoring backup to local database..."
psql -d "$LOCAL_DB_NAME" < prod_backup.sql || true

# Remove backup file
echo "Cleaning up..."
rm prod_backup.sql

echo "Database restore completed."