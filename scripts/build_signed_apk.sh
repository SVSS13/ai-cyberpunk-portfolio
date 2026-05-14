#!/bin/bash

echo "================================="
echo "BUILDING PRODUCTION FRONTEND"
echo "================================="

cd frontend

npm install

npm run build

echo "================================="
echo "SYNCING CAPACITOR"
echo "================================="

npx cap sync android

echo "================================="
echo "OPENING ANDROID STUDIO"
echo "================================="

npx cap open android