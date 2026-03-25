#!/bin/sh
set -e

echo "Aguardando banco..."
python -c "
import time, psycopg2, os
for i in range(30):
    try:
        psycopg2.connect(os.environ['DATABASE_URL'])
        break
    except Exception:
        time.sleep(1)
"

echo "Criando tabelas..."
python -c "
from app import create_app
from app.database import db
app = create_app()
with app.app_context():
    db.create_all()
print('Tabelas OK')
"

exec gunicorn wsgi:app \
    --bind 0.0.0.0:${PORT:-8080} \
    --workers 1 \
    --threads 8 \
    --timeout 120
