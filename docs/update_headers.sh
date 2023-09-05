#!/bin/bash

# Function to extract the last modified date of a file from git
get_last_modified_date() {
    git log -1 --format="%ai" "$1"
}

# Function to extract the author of a file from git
get_author() {
    git log -1 --format="%an" "$1"
}

update_metadata() {
    # File to be updated
    local file="$1"
    local last_modified_date="$2"
    local author="$3"

    awk -v lmd="$last_modified_date" -v author="$author" '
    BEGIN { in_header = 0; replaced = 0; }
    /^---/ {
        if (in_header == 0) {
            in_header = 1;
        } else {
            in_header = 0;
            if (replaced == 0) {
                print "last_update:";
                print "  date:", lmd;
                print "  author:", author;
                replaced = 1;
            }
        }
    }
    /^last_update:/ {
        if (in_header == 1) {
            replaced = 1;
            print "last_update:";
            print "  date:", lmd;
            print "  author:", author;
            for(i=0; i<2 && getline; i++); # skip the next two lines
            next;
        }
    }
    {
        print;
    }' "$file" > "${file}.tmp"

    # Move the temporary file to the original file
    mv "${file}.tmp" "$file"
}

# Traverse through all .md and .mdx files in the /docs folder
for file in $(find ./docs -type f \( -name "*.md" -o -name "*.mdx" \)); do
    # Get the last modified date and author using git
    last_modified_date=$(get_last_modified_date "$file")
    author=$(get_author "$file")

    # Update the metadata in the file
    update_metadata "$file" "$last_modified_date" "$author"

    echo "Updated header for $file"
done
