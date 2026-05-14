#!/bin/bash

echo "Building Android app..."

cd frontend

npm run build

npx cap sync android

npx cap open android