#!/usr/bin/env python3
"""
GitHub Pages QR Code Generator
Professional QR code generation with multiple size presets and campaign management.
"""

import qrcode
from qrcode.constants import ERROR_CORRECT_Q, ERROR_CORRECT_H
try:
    from qrcode.image.svg import SvgImage
except ImportError:
    SvgImage = None
import argparse
import os
import json
from pathlib import Path
from urllib.parse import urljoin
import sys

class GitHubPagesQRGenerator:
    """Professional QR code generator optimized for GitHub Pages hosting."""

    def __init__(self, base_url=""):
        self.base_url = base_url
        self.output_dir = Path("assets/qr-codes")
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Size presets based on use cases
        self.size_presets = {
            'business': {'box_size': 8, 'description': 'Business cards (2cm x 2cm)'},
            'flyer': {'box_size': 12, 'description': 'Flyers and handouts (4cm x 4cm)'},
            'poster': {'box_size': 20, 'description': 'Posters and displays (10cm x 10cm)'},
            'signage': {'box_size': 30, 'description': 'Large signage (15cm x 15cm)'},
            'digital': {'box_size': 10, 'description': 'Digital displays and screens'}
        }

        # Campaign configurations
        self.campaigns = {
            'msft-2025': {
                'destination': 'https://accionlabs.com/microsoft-event',
                'utm_params': {
                    'utm_source': 'msft_booth',
                    'utm_medium': 'qr',
                    'utm_campaign': '2025'
                }
            },
            'business-cards': {
                'destination': 'https://yourdomain.com/contact',
                'utm_params': {
                    'utm_source': 'business_card',
                    'utm_medium': 'qr',
                    'utm_campaign': 'networking'
                }
            }
        }

    def generate_analytics_url(self, base_url, utm_params):
        """Generate URL with UTM parameters for analytics tracking."""
        if not utm_params:
            return base_url

        params = []
        for key, value in utm_params.items():
            params.append(f"{key}={value}")

        separator = '&' if '?' in base_url else '?'
        return f"{base_url}{separator}{'&'.join(params)}"

    def generate_qr_code(self, data, filename, size_preset='digital', error_correction='Q'):
        """Generate QR code in both SVG and PNG formats."""
        error_levels = {
            'L': qrcode.constants.ERROR_CORRECT_L,
            'M': qrcode.constants.ERROR_CORRECT_M,
            'Q': qrcode.constants.ERROR_CORRECT_Q,
            'H': qrcode.constants.ERROR_CORRECT_H
        }

        error_correct = error_levels.get(error_correction, ERROR_CORRECT_Q)
        box_size = self.size_presets.get(size_preset, {'box_size': 10})['box_size']

        results = {}

        # Generate PNG (works with basic qrcode package)
        qr_png = qrcode.QRCode(
            version=1,
            error_correction=error_correct,
            box_size=box_size,
            border=4
        )
        qr_png.add_data(data)
        qr_png.make(fit=True)

        png_path = self.output_dir / f"{filename}.png"
        img_png = qr_png.make_image(fill_color="black", back_color="white")
        img_png.save(str(png_path))
        results['png'] = str(png_path)

        # Generate SVG (if available)
        if SvgImage:
            qr_svg = qrcode.QRCode(
                version=1,
                error_correction=error_correct,
                box_size=box_size,
                border=4
            )
            qr_svg.add_data(data)
            qr_svg.make(fit=True)

            svg_path = self.output_dir / f"{filename}.svg"
            img_svg = qr_svg.make_image(image_factory=SvgImage)
            img_svg.save(str(svg_path))
            results['svg'] = str(svg_path)
        else:
            print("⚠️  SVG support not available. Install with: pip install qrcode[pil]")

        return results

    def generate_campaign_qr(self, campaign_name, size_preset='digital'):
        """Generate QR code for a predefined campaign."""
        if campaign_name not in self.campaigns:
            raise ValueError(f"Campaign '{campaign_name}' not found. Available: {list(self.campaigns.keys())}")

        campaign = self.campaigns[campaign_name]

        # Create redirect URL (GitHub Pages URL + campaign path)
        redirect_url = urljoin(self.base_url, campaign_name)

        # Generate QR code pointing to redirect URL
        files = self.generate_qr_code(
            data=redirect_url,
            filename=f"{campaign_name}-qr",
            size_preset=size_preset
        )

        print(f"✅ Generated QR code for campaign '{campaign_name}':")
        print(f"   📱 Redirect URL: {redirect_url}")
        print(f"   🎯 Final destination: {campaign['destination']}")
        print(f"   📁 Files: {files}")

        return files

    def generate_all_campaigns(self, size_preset='digital'):
        """Generate QR codes for all predefined campaigns."""
        results = {}
        for campaign_name in self.campaigns.keys():
            try:
                results[campaign_name] = self.generate_campaign_qr(campaign_name, size_preset)
            except Exception as e:
                print(f"❌ Error generating QR for {campaign_name}: {e}")

        return results

    def list_campaigns(self):
        """List all available campaigns with details."""
        print("\n📋 Available Campaigns:")
        print("-" * 50)
        for name, config in self.campaigns.items():
            print(f"🏷️  {name}")
            print(f"   Destination: {config['destination']}")
            print(f"   UTM params: {config.get('utm_params', 'None')}")
            print()

    def list_size_presets(self):
        """List all available size presets."""
        print("\n📏 Available Size Presets:")
        print("-" * 50)
        for name, config in self.size_presets.items():
            print(f"📐 {name}: {config['description']} (box_size: {config['box_size']})")
        print()

def main():
    parser = argparse.ArgumentParser(
        description="Generate professional QR codes for GitHub Pages hosting",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python qr_generator.py --list-campaigns
  python qr_generator.py --campaign msft-2025 --size poster
  python qr_generator.py --all --size business
  python qr_generator.py --url "https://example.com" --filename custom-qr
        """
    )

    parser.add_argument('--base-url', 
                      default='https://YOUR_USERNAME.github.io/qr-hosting/',
                      help='Base URL for your GitHub Pages site')

    parser.add_argument('--campaign', 
                      help='Generate QR for specific campaign')

    parser.add_argument('--all', 
                      action='store_true',
                      help='Generate QR codes for all campaigns')

    parser.add_argument('--url', 
                      help='Custom URL to generate QR code for')

    parser.add_argument('--filename', 
                      help='Custom filename (used with --url)')

    parser.add_argument('--size', 
                      default='digital',
                      choices=['business', 'flyer', 'poster', 'signage', 'digital'],
                      help='Size preset for the QR code')

    parser.add_argument('--error-correction',
                      default='Q',
                      choices=['L', 'M', 'Q', 'H'],
                      help='Error correction level (Q recommended)')

    parser.add_argument('--list-campaigns',
                      action='store_true',
                      help='List all available campaigns')

    parser.add_argument('--list-sizes',
                      action='store_true',
                      help='List all available size presets')

    args = parser.parse_args()

    generator = GitHubPagesQRGenerator(base_url=args.base_url)

    if args.list_campaigns:
        generator.list_campaigns()
        return

    if args.list_sizes:
        generator.list_size_presets()
        return

    if args.all:
        print(f"🚀 Generating QR codes for all campaigns (size: {args.size})...")
        generator.generate_all_campaigns(size_preset=args.size)
        return

    if args.campaign:
        generator.generate_campaign_qr(args.campaign, size_preset=args.size)
        return

    if args.url and args.filename:
        files = generator.generate_qr_code(
            data=args.url,
            filename=args.filename,
            size_preset=args.size,
            error_correction=args.error_correction
        )
        print(f"✅ Generated custom QR code:")
        print(f"   📱 URL: {args.url}")
        print(f"   📁 Files: {files}")
        return

    # Default action - generate all campaigns
    print("🚀 No specific action specified. Generating all campaigns...")
    print("💡 Use --help to see all available options")
    generator.generate_all_campaigns(size_preset=args.size)

if __name__ == "__main__":
    # Check if required packages are installed
    try:
        import qrcode
    except ImportError:
        print("❌ Error: qrcode library not installed")
        print("📦 Install with: pip install qrcode[pil]")
        sys.exit(1)

    main()
