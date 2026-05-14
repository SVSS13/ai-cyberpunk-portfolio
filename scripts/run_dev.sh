#!/bin/bash

echo "Starting backend..."

cd backend
python manage.py runserver &

cd ../frontend

echo "Starting frontend..."

npm run dev