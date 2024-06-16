#!/bin/bash

# Manage the backups of the production database.
# Before running this script, you must run:
# $ sudo apt-get install awscli
# $ pip install awscli-plugin-endpoint
# $ chmod +x db_backup.sh 

set -euo pipefail
IFS=$'\n\t'

# Log function
log() {
    local level="$1"
    local message="$2"
    echo "[$(date '+%m/%d/%Y %I:%M:%S %p')] [DB BACKUP] $level: $message" | tee -a db_backup.log
}

# Load environment variables
log "INFO" "Getting environment variables."
if [ -f "../backend.env" ]; then
    source ../backend.env
else
    log "ERROR" "Environment file not found!"
    exit 1
fi

DB_USER="${POSTGRES_USER}"
DB_NAME="${POSTGRES_DB}"
DB_CONTAINER="${DB_CONTAINER}"
BUCKET="${S3_BUCKET_PRIVATE}"
AWS_ACCESS_KEY_ID="${OVH_ACCESS_KEY_ID}"
AWS_SECRET_ACCESS_KEY="${OVH_SECRET_ACCESS_KEY}"
DISCORD_WEBHOOK="${DISCORD_BACKUP_STATUS_WEBHOOK}"

log "INFO" "Done getting environment variables."

send_success_notification() {
    local file_path="$1"
    local size="$2"
    local files_deleted="$3"
    local size_text=$(echo "scale=3; $size / 1048576" | bc)
    local delete_status="$files_deleted files deleted. 🟢"

    curl -s -H "Content-Type: application/json" -X POST -d "{
        \"embeds\": [{
            \"title\": \"💾 **Database Backup Status** 💾\",
            \"fields\": [
                {\"name\": \"Status\", \"value\": \"Success 🟢\", \"inline\": true},
                {\"name\": \"File Name\", \"value\": \"\`$file_path\`\", \"inline\": true},
                {\"name\": \"File Size\", \"value\": \"${size_text} Mo\", \"inline\": true},
                {\"name\": \"Cleanup Status\", \"value\": \"$delete_status\", \"inline\": true}
            ],
            \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
        }]
    }" $DISCORD_WEBHOOK > /dev/null
}

send_error_notification() {
    local error_message="$1"
    log "ERROR" "$error_message"

    curl -s -H "Content-Type: application/json" -X POST -d "{
        \"embeds\": [{
            \"title\": \"💾 **Database Backup Status** 💾\",
            \"fields\": [
                {\"name\": \"Status\", \"value\": \"Error 🔴\", \"inline\": true},
                {\"name\": \"Error Message\", \"value\": \"\`$error_message\`\", \"inline\": true}
            ],
            \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
        }]
    }" $DISCORD_WEBHOOK > /dev/null
}

backup() {
    log "INFO" "Dumping db."
    if ! docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > output.sql.gz; then
        send_error_notification "Database dump failed"
        exit 1
    fi
    log "INFO" "Done dumping db."

    log "INFO" "Uploading to S3."
    export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
    export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"

    local object_name
    object_name=$(date +"%Y-%m-%d_%H-%M-%S").sql.gz
    local size
    size=$(stat -c%s output.sql.gz)

    if ! aws --endpoint-url=https://s3.gra.cloud.ovh.net/ s3 cp output.sql.gz "s3://$BUCKET/backups/$object_name"; then
        send_error_notification "S3 upload failed"
        rm output.sql.gz
        exit 1
    fi
    rm output.sql.gz
    log "INFO" "Done uploading to S3."

    log "INFO" "Cleaning up old backups."
    local files
    files=$(aws --endpoint-url=https://s3.gra.cloud.ovh.net/ s3 ls "s3://$BUCKET/backups/" | awk '{print $4}' | sort)
    local file_count
    file_count=$(echo "$files" | wc -l)
    local files_to_delete
    files_to_delete=$((file_count - 10))  # Keep only yhe 10 most recent files
    local counter=0
    if [ "$files_to_delete" -gt 0 ]; then
        for file in $(echo "$files" | head -n "$files_to_delete"); do
            aws --endpoint-url=https://s3.gra.cloud.ovh.net/ s3 rm "s3://$BUCKET/backups/$file"
            counter=$((counter + 1))
        done
    fi
    log "INFO" "$counter files have been deleted."

    send_success_notification "$object_name" "$size" "$counter"
}

main() {
    log "INFO" "Starting database backup."
    backup
    log "INFO" "Success."
}

main "$@"
