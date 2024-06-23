#!/bin/bash

# Make a copy of the production database onto the staging server.
# If an error occurs, send it to a Discord channel.

set -euo pipefail
IFS=$'\n\t'

# Log function
log() {
    local level="$1"
    local message="$2"
    echo "[$(date '+%m/%d/%Y %I:%M:%S %p')] [DB STAGING] $level: $message" | tee -a db_staging.log
}

# Load environment variables
log "INFO" "Getting environment variables."
if [ -f "../backend.env" ]; then
    source ../backend.env
else
    log "ERROR" "Environment file not found!"
    send_error_status "Environment file not found!"
    exit 1
fi

DB_USER="${POSTGRES_USER}"
DB_PASSWORD="${POSTGRES_PASSWORD}"
DB_NAME_PROD="${POSTGRES_DB}"
DB_NAME_STAGING="${POSTGRES_DB_STAGING}"
DB_CONTAINER="${DB_CONTAINER}"
DISCORD_WEBHOOK="${DISCORD_BACKUP_STATUS_WEBHOOK}"

log "INFO" "Done getting environment variables."

send_error_status() {
    local message="$1"

    curl -s -H "Content-Type: application/json" -X POST -d "{
        \"embeds\": [{
            \"title\": \"**Database Copy From Production To Staging**\",
            \"fields\": [
                {\"name\": \"Status\", \"value\": \"Error 🔴\", \"inline\": true},
                {\"name\": \"Message\", \"value\": \"\`$message\`\", \"inline\": true}
            ],
            \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
        }]
    }" $DISCORD_WEBHOOK > /dev/null
}

copy_database() {
    log "INFO" "Starting database copy for staging."

    log "INFO" "Dropping the old target DB if it exists."
    if ! docker exec "$DB_CONTAINER" bash -c "psql -U $DB_USER -c 'DROP DATABASE IF EXISTS $DB_NAME_STAGING WITH (FORCE);'"; then
        log "ERROR" "Failed to drop the target database."
        send_error_status "Failed to drop the target database."
        exit 1
    fi
    log "INFO" "Dropped the old target DB."

    log "INFO" "Recreating the target DB."
    if ! docker exec "$DB_CONTAINER" bash -c "psql -U $DB_USER -c 'CREATE DATABASE $DB_NAME_STAGING OWNER $DB_USER;'"; then
        log "ERROR" "Failed to create the target database."
        send_error_status "Failed to create the target database."
        exit 1
    fi
    log "INFO" "Recreated the target DB."

    log "INFO" "Dumping the contents of the source DB."
    if ! docker exec "$DB_CONTAINER" bash -c "pg_dump -U $DB_USER $DB_NAME_PROD > dump.sql"; then
        log "ERROR" "Failed to dump the source database."
        send_error_status "Failed to dump the source database."
        exit 1
    fi
    log "INFO" "Dumped the contents of the source DB."

    log "INFO" "Importing the contents to the target DB."
    if ! docker exec "$DB_CONTAINER" bash -c "psql -U $DB_USER $DB_NAME_STAGING < dump.sql"; then
        log "ERROR" "Failed to import the dump into the target database."
        send_error_status "Failed to import the dump into the target database."
        exit 1
    fi
    log "INFO" "Imported the contents to the target DB."

    log "INFO" "Database copy completed successfully."
}

copy_database
