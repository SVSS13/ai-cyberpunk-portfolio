#!/bin/bash

echo "================================="
echo "BUILDING PRODUCTION FRONTEND"
echo "================================="

cd frontend || exit

npm install

npm run build

echo "================================="
echo "SYNCING CAPACITOR"
echo "================================="

npx cap sync android

echo "================================="
echo "BUILDING SIGNED RELEASE APK"
echo "================================="

cd android || exit

./gradlew assembleRelease

echo "================================="
echo "SIGNED APK GENERATED"
echo "================================="

echo "APK LOCATION:"
echo "app/build/outputs/apk/release/app-release.apk"