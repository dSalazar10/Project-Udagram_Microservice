#!/usr/bin/env bash

## Complete the following steps to get Docker running locally
DOCKERPATH="dsalazar10/udagram:user"

# Step 1:
# Build image and add a descriptive tag
docker build -t $DOCKERPATH .

# Step 2: 
# List docker images
docker image ls

# Step 3: 
# Run service
#docker run -it -p 8080:8080 --rm $DOCKERPATH