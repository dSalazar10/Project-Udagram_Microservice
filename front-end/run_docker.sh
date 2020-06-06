#!/usr/bin/env bash

## Complete the following steps to get Docker running locally
DOCKERPATH="dsalazar10/udagram:frontend"
 
# Run service
docker run -it -p 8100:8100 --rm $DOCKERPATH