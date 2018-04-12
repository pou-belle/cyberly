#!/bin/bash

git filter-branch --env-filter '
OLD_EMAIL="dlachanas@gmail.com"
CORRECT_NAME="Markella"
CORRECT_EMAIL="markellazax@gmail.com"

    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
' --tag-name-filter cat -- --branches --tags