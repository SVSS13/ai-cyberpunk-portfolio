#!/bin/bash

echo "Preparing backend deployment..."

cd backend

pip install -r requirements.txt

python manage.py collectstatic --noinput

python manage.py migrate

echo "Backend ready for Render."