#!/bin/bash

cd /api

echo "**$(date +%Y-%m-%d\ %H:%M:%S) : start on deploy"

npm install
npm run prod

echo "**$(date +%Y-%m-%d\ %H:%M:%S) : finish on deploy"