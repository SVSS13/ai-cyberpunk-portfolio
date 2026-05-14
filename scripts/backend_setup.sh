#!/bin/bash

echo "Setting up backend..."

cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py collectstatic --noinput

echo "Backend setup complete."