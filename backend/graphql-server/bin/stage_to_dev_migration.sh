#!/bin/bash

# Backup stage database
pg_dump -h localhost -d kettlepal-stage > kettlepal_stage_backup.sql

# Drop existing dev database
psql -d postgres -c 'DROP DATABASE IF EXISTS "kettlepal-dev"'

# Create a new dev database
psql -d postgres -c 'CREATE DATABASE "kettlepal-dev"'

# Restore backup to dev database, skipping errors
psql -d kettlepal-dev < kettlepal_stage_backup.sql || true

# Remove backup file
rm kettlepal_stage_backup.sql
