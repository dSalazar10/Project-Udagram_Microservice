#!/bin/bash
# This file tags and uploads an image to Docker Hub
# Assumes that an image is built via `run_docker.sh`

# Create dockerpath
DOCKERPATH="dsalazar10/udagram:user"

# Authenticate
docker login

# Build image and add a descriptive tag
docker build -t $DOCKERPATH .

# Push image to a docker repository
docker push $DOCKERPATH