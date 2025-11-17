#!/bin/bash

# UMS Deployment Script
# This script helps deploy the UMS application

echo "🚀 UMS Deployment Script"
echo "========================"

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "❌ Please do not run as root"
   exit 1
fi

# Function to deploy backend
deploy_backend() {
    echo ""
    echo "📦 Deploying Backend..."
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    echo "Installing dependencies..."
    pip install -r requirements.txt
    
    # Initialize database
    echo "Initializing database..."
    python reset_database.py
    
    echo "✅ Backend deployment complete!"
    echo ""
    echo "To start the backend server:"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  gunicorn --bind 0.0.0.0:5000 --workers 3 wsgi:app"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo ""
    echo "📦 Deploying Frontend..."
    cd frontend
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    # Build for production
    echo "Building for production..."
    npm run build
    
    echo "✅ Frontend deployment complete!"
    echo ""
    echo "Build output is in: frontend/dist"
    echo "You can serve this with:"
    echo "  - Nginx"
    echo "  - Apache"
    echo "  - Any static file server"
    cd ..
}

# Main menu
echo ""
echo "Select deployment option:"
echo "1) Deploy Backend only"
echo "2) Deploy Frontend only"
echo "3) Deploy Both"
echo "4) Exit"
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        deploy_backend
        ;;
    2)
        deploy_frontend
        ;;
    3)
        deploy_backend
        deploy_frontend
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set up environment variables (see .env.example files)"
echo "2. Configure your web server (see DEPLOYMENT.md)"
echo "3. Set up SSL certificates for production"
echo "4. Configure CORS settings in backend"

