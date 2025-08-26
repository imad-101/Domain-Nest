#!/bin/bash

# Environment switcher script for DomNest

if [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    echo "🔄 Switching to development environment..."
    cp .env.development .env
    echo "✅ Development environment activated"
    echo "🌐 App URL: http://localhost:3000"
elif [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    echo "🔄 Switching to production environment..."
    cp .env.production .env
    echo "✅ Production environment activated"
    echo "🌐 App URL: https://domnest.app"
else
    echo "Usage: ./switch-env.sh [dev|prod]"
    echo ""
    echo "Commands:"
    echo "  dev, development  - Switch to development environment"
    echo "  prod, production  - Switch to production environment"
    echo ""
    echo "Current environment:"
    if grep -q "localhost" .env 2>/dev/null; then
        echo "  📍 Development (localhost:3000)"
    elif grep -q "domnest.app" .env 2>/dev/null; then
        echo "  📍 Production (domnest.app)"
    else
        echo "  ❓ Unknown or no .env file found"
    fi
fi
