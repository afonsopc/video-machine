#!/bin/sh

STATIC_JSON=static.json
STATIC_DIR=static

echo "{" > $STATIC_JSON
find $STATIC_DIR -type f | while read file; do
    echo "\"/${file#"$STATIC_DIR"/}\": \"$(base64 -i "$file")\","
done >> $STATIC_JSON
sed -i '' -e '$ s/.$//' $STATIC_JSON
echo "}" >> $STATIC_JSON
