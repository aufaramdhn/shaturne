#!/usr/bin/env bash
set -e

php artisan migrate --force
if [ "${RUN_SEED:-false}" = "true" ]; then
    php artisan db:seed --force
fi
php artisan storage:link 2>/dev/null || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec php artisan serve --host 0.0.0.0 --port "${PORT:-8000}"
