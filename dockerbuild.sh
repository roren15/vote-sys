#!/usr/bin/env bash

echo "**$(date +%Y-%m-%d\ %H:%M:%S) : start on building docker image"

docker build -t vote-system:v1 .
docker tag vote-system:v1 roren/vote-system:v1
docker push roren/vote-system:v1

echo "**$(date +%Y-%m-%d\ %H:%M:%S) :finish building docker image"