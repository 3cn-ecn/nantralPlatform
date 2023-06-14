#!/bin/bash

# Function to extract the last modified date of a file from git
get_last_modified_date() {
    git log -1 --format="%ai" "$1"
}

# Function to extract the author of a file from git
get_author() {
    git log -1 --format="%an" "$1"
}

sed_command() {
    # Detect the sed command syntax based on the operating system
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS (BSD sed)
        sed -i '' -e "$1" "$2"
    else
        # Linux (GNU sed)
        sed -i -e "$1" "$2"
    fi
}

# Traverse through all .md and .mdx files in the /docs folder
for file in $(find ./docs -type f \( -name "*.md" -o -name "*.mdx" \)); do
    # Get the last modified date and author using git
    last_modified_date=$(get_last_modified_date "$file")
    author=$(get_author "$file")

    # Check if the last_update line exists in the file
    if ! grep -q '^last_update:' "$file"; then
        # Add the last_update section at the beginning of the file
        sed_command "2i\\
last_update:\\
  date: $last_modified_date\\
  author: $author" "$file"
    else
        # Update the existing last_update line
        sed_command "s#^last_update:\n  date:.*\n  author:.*#last_update:\n  date: $last_modified_date\n  author: $author#" "$file"
    fi

    echo "Updated header for $file"
done
