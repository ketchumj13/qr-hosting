# 📁 Project Structure Overview

```
qr-hosting/
├── 📄 dashboard.html              # Main web dashboard interface
├── 📄 index.html                  # Homepage/default redirect  
├── 📄 msft-2025.html             # Microsoft campaign page
├── 📄 business-cards.html        # Business card campaign page
├── 📄 404.html                    # Custom error page
├── 📄 _config.yml                # Jekyll configuration
├── 📄 CNAME                       # Custom domain config
├── 📄 package.json                # Node.js dependencies
├── 📄 qr_generator.py            # Python QR generator
├── 📄 qr_generator.js            # Node.js QR generator  
├── 📄 deploy.sh                   # Deployment script
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml         # GitHub Actions workflow
│
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── 📄 style.css          # Base styling
│   │   └── 📄 dashboard.css      # Dashboard styling
│   ├── 📁 js/
│   │   ├── 📄 analytics.js       # Analytics tracking
│   │   └── 📄 dashboard.js       # Dashboard functionality
│   └── 📁 qr-codes/              # Generated QR code files
│       └── 📄 README.md          # QR codes info
│
└── 📁 docs/                      # Documentation
    ├── 📄 README.md              # Main documentation
    ├── 📄 SETUP.md               # Setup guide
    ├── 📄 PROJECT_STRUCTURE.md   # This file
    ├── 📄 DEPLOYMENT_CHECKLIST.md # Deployment checklist
    └── 📄 LICENSE                # MIT License
```

## 🔧 File Functions

### Core HTML Files
- **dashboard.html**: Complete web-based QR management interface
- **index.html**: System homepage with feature overview
- **[campaign].html**: Individual campaign redirect pages
- **404.html**: Custom error page for invalid QR codes

### Configuration Files  
- **_config.yml**: Jekyll settings for GitHub Pages
- **package.json**: Node.js dependencies and scripts
- **CNAME**: Custom domain configuration

### Generation Scripts
- **qr_generator.py**: Python-based QR code generator with campaign support
- **qr_generator.js**: Node.js-based QR code generator with CLI interface
- **deploy.sh**: Automated deployment script

### Assets
- **style.css**: Base responsive CSS for redirect pages
- **dashboard.css**: Complete styling for web dashboard
- **analytics.js**: Privacy-focused tracking system
- **dashboard.js**: Full dashboard functionality and interactivity
- **qr-codes/**: Generated QR code files (SVG + PNG)

### Automation
- **deploy.yml**: GitHub Actions for automatic deployment and QR generation
- **workflows/**: CI/CD pipeline configuration

This structure provides a complete, production-ready QR code system that's maintainable, scalable, and completely free to operate.
