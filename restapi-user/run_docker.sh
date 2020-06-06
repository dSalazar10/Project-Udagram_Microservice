#!/usr/bin/env bash

## Complete the following steps to get Docker running locally
DOCKERPATH="dsalazar10/udagram:user"

# Run service
docker run -it -p 8080:8080 --rm $DOCKERPATH