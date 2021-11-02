#!/bin/bash
# restore db dump to mongodb container

# check if lockfile exists in filesystem

if [ -f "lock.file" ]; then
    echo "lock.file exists."
    exit 0
fi

for dump in /mongo-seed/data/*.json; do
    mongoimport --uri mongodb://$MONGO_USER:$MONGO_PASSWORD@mongodb/$DB_NAME?authSource=admin --type json --file $dump &>/dev/null
done

# create lock.file
echo `date` > lock.file