# 🚀 GitHub Pages QR Code System - Complete Setup Guide

## Quick Setup (5 Minutes)

### 1. Fork & Clone
```bash
# 1. Fork this repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/qr-hosting.git
cd qr-hosting
```

### 2. Customize Configuration
```bash
# Update all YOUR_USERNAME placeholders with your GitHub username
find . -type f -name "*.html" -o -name "*.md" -o -name "*.yml" | xargs sed -i 's/YOUR_USERNAME/your-github-username/g'

# Update your domain (optional)
echo "go.yourdomain.com" > CNAME
```

### 3. Generate QR Codes
```bash
# Option A: Python
pip install qrcode[pil]
python qr_generator.py --all

# Option B: Node.js  
npm install
npm run generate
```

### 4. Deploy to GitHub Pages
```bash
# Automated deployment
./deploy.sh

# Manual deployment
git add .
git commit -m "Initial QR system setup"
git push origin main
```

### 5. Enable GitHub Pages
1. Go to your repository **Settings**
2. Navigate to **Pages** section
3. Select **Source**: Deploy from a branch
4. Select **Branch**: main, **Folder**: / (root)
5. Click **Save**

## 🎯 Your QR System is Live!

**URLs:**
- Dashboard: `https://your-username.github.io/qr-hosting/dashboard.html`
- Homepage: `https://your-username.github.io/qr-hosting/`
- Microsoft Campaign: `https://your-username.github.io/qr-hosting/msft-2025`
- Business Cards: `https://your-username.github.io/qr-hosting/business-cards`

## 📋 Campaign Management

### Add New Campaign
```bash
# 1. Create redirect HTML page
cp msft-2025.html new-campaign.html

# 2. Edit destination URL in new-campaign.html
# 3. Add campaign to qr_generator.py or qr_generator.js
# 4. Generate QR code
python qr_generator.py --campaign new-campaign --size poster

# 5. Deploy
git add . && git commit -m "Add new campaign" && git push
```

## 📊 Analytics Setup

### Google Analytics 4
1. Create GA4 property at https://analytics.google.com
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Edit `assets/js/analytics.js` or use dashboard settings

### Plausible Analytics (Privacy-Focused Alternative)
1. Sign up at https://plausible.io
2. Add your domain
3. Configure in dashboard settings

## 🎨 Customization

### Custom Domain Setup
```bash
# Add your domain to CNAME file
echo "go.yourdomain.com" > CNAME

# Configure DNS (at your domain registrar)
# Type: CNAME
# Name: go
# Value: your-username.github.io
```

## 🔧 Troubleshooting

### Common Issues

**QR Code Won't Scan:**
- ✅ Check minimum size (2cm x 2cm for 1m distance)
- ✅ Ensure high contrast (black on white)
- ✅ Preserve quiet zone (white border)
- ✅ Use error correction level Q or H

**GitHub Pages Not Working:**
- ✅ Check repository Settings > Pages is enabled
- ✅ Verify branch is set to "main"
- ✅ Wait 5-10 minutes for deployment
- ✅ Check GitHub Actions tab for build errors

**Custom Domain Issues:**
- ✅ Verify DNS propagation: `nslookup go.yourdomain.com`
- ✅ Check CNAME file contains only domain name
- ✅ Ensure HTTPS is enforced
- ✅ Wait up to 24 hours for DNS changes

## 🎉 Congratulations!

You now have a completely free, self-hosted QR code system with:
- ✅ Professional QR code generation
- ✅ Custom redirect management  
- ✅ Privacy-focused analytics
- ✅ No ongoing costs
- ✅ Complete ownership and control

**Total Cost: $0** (vs $60-420/year for commercial services)

*Happy QR coding! 🚀*
