#!/bin/bash

# GitHub Pages QR Code System - Deployment Script
# Run this script to deploy your QR system to GitHub Pages

set -e  # Exit on any error

echo "🚀 Deploying QR Code System to GitHub Pages"
echo "=============================================="

# Configuration
REPO_URL="https://github.com/YOUR_USERNAME/qr-hosting.git"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi

    # Check Node.js (optional)
    if command -v node &> /dev/null; then
        print_success "Node.js $(node --version) found"
    else
        print_warning "Node.js not found - Python QR generation only"
    fi

    # Check Python (optional)
    if command -v python3 &> /dev/null; then
        print_success "Python $(python3 --version) found"
    elif command -v python &> /dev/null; then
        print_success "Python $(python --version) found"
    else
        print_warning "Python not found - Node.js QR generation only"
    fi

    print_success "Prerequisites check complete"
}

# Generate QR codes
generate_qr_codes() {
    print_info "Generating QR codes..."

    # Create output directory
    mkdir -p assets/qr-codes

    # Try Node.js first
    if command -v npm &> /dev/null && [ -f package.json ]; then
        print_info "Installing Node.js dependencies..."
        npm install

        print_info "Generating QR codes with Node.js..."
        npm run generate || print_warning "Node.js QR generation failed"
    fi

    # Try Python
    if command -v python3 &> /dev/null; then
        print_info "Generating QR codes with Python..."
        python3 qr_generator.py --all || print_warning "Python QR generation failed"
    elif command -v python &> /dev/null; then
        print_info "Generating QR codes with Python..."
        python qr_generator.py --all || print_warning "Python QR generation failed"
    fi

    # Check if any QR codes were generated
    if [ -z "$(ls -A assets/qr-codes 2>/dev/null)" ]; then
        print_warning "No QR codes generated - you may need to install dependencies"
        print_info "Install Python: pip install qrcode[pil]"
        print_info "Install Node.js: npm install"
    else
        print_success "QR codes generated successfully"
        ls -la assets/qr-codes/
    fi
}

# Validate files
validate_deployment() {
    print_info "Validating deployment files..."

    # Check required files
    required_files=("index.html" "dashboard.html" "_config.yml" "assets/css/style.css" "assets/js/analytics.js")

    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "Found $file"
        else
            print_error "Missing required file: $file"
            exit 1
        fi
    done

    # Check HTML files for basic structure
    for file in *.html; do
        if grep -q "<html" "$file" && grep -q "</html>" "$file"; then
            print_success "HTML structure valid: $file"
        else
            print_warning "Potential HTML issues in: $file"
        fi
    done

    print_success "File validation complete"
}

# Deploy to GitHub
deploy_to_github() {
    print_info "Deploying to GitHub..."

    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        print_info "Initializing Git repository..."
        git init
        git remote add origin "$REPO_URL"
    fi

    # Stage all files
    print_info "Staging files..."
    git add .

    # Commit changes
    COMMIT_MESSAGE="Deploy QR code system - $(date '+%Y-%m-%d %H:%M:%S')"
    print_info "Committing: $COMMIT_MESSAGE"
    git commit -m "$COMMIT_MESSAGE" || print_info "No changes to commit"

    # Push to GitHub
    print_info "Pushing to GitHub..."
    git push origin "$BRANCH"

    print_success "Deployment to GitHub complete!"
}

# Main deployment process
main() {
    echo
    print_info "Starting deployment process..."
    echo

    # Run deployment steps
    check_prerequisites
    echo

    generate_qr_codes
    echo

    validate_deployment
    echo

    deploy_to_github
    echo

    print_success "🎉 Deployment completed successfully!"
    echo
    print_info "Your QR code system will be available at:"
    print_info "https://YOUR_USERNAME.github.io/qr-hosting/"
    echo
    print_warning "Note: GitHub Pages deployment may take 5-10 minutes to go live"
    print_info "Check status at: https://github.com/YOUR_USERNAME/qr-hosting/actions"
    echo
    print_info "Next steps:"
    echo "  1. Update YOUR_USERNAME in HTML files with your GitHub username"
    echo "  2. Configure custom domain in CNAME file (optional)"
    echo "  3. Set up analytics in assets/js/analytics.js"
    echo "  4. Test your QR codes with multiple devices"
}

# Handle script interruption
cleanup() {
    print_warning "Deployment interrupted"
    exit 1
}

trap cleanup INT TERM

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
