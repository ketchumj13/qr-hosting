#!/usr/bin/env node
/**
 * GitHub Pages QR Code Generator (Node.js)
 * Professional QR code generation with campaign management
 */

const QRCode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');

class GitHubPagesQRGenerator {
    constructor(baseUrl = 'https://YOUR_USERNAME.github.io/qr-hosting/') {
        this.baseUrl = baseUrl;
        this.outputDir = path.join('assets', 'qr-codes');

        // Size presets optimized for different use cases
        this.sizePresets = {
            business: { width: 200, description: 'Business cards (2cm x 2cm)' },
            flyer: { width: 300, description: 'Flyers and handouts (4cm x 4cm)' },
            poster: { width: 500, description: 'Posters and displays (10cm x 10cm)' },
            signage: { width: 750, description: 'Large signage (15cm x 15cm)' },
            digital: { width: 400, description: 'Digital displays and screens' }
        };

        // Campaign configurations with analytics
        this.campaigns = {
            'msft-2025': {
                destination: 'https://accionlabs.com/microsoft-event',
                utmParams: {
                    utm_source: 'msft_booth',
                    utm_medium: 'qr',
                    utm_campaign: '2025'
                }
            },
            'business-cards': {
                destination: 'https://yourdomain.com/contact',
                utmParams: {
                    utm_source: 'business_card',
                    utm_medium: 'qr',
                    utm_campaign: 'networking'
                }
            }
        };
    }

    async ensureOutputDir() {
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch (error) {
            // Directory already exists
        }
    }

    generateAnalyticsUrl(baseUrl, utmParams) {
        if (!utmParams) return baseUrl;

        const url = new URL(baseUrl);
        Object.entries(utmParams).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        return url.toString();
    }

    async generateQRCode(data, filename, sizePreset = 'digital', errorCorrection = 'Q') {
        await this.ensureOutputDir();

        const size = this.sizePresets[sizePreset] || this.sizePresets.digital;
        const options = {
            errorCorrectionLevel: errorCorrection,
            type: 'image/png',
            quality: 0.92,
            margin: 4,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: size.width
        };

        const results = {};

        try {
            // Generate PNG
            const pngPath = path.join(this.outputDir, `${filename}.png`);
            await QRCode.toFile(pngPath, data, { ...options, type: 'png' });
            results.png = pngPath;

            // Generate SVG
            const svgPath = path.join(this.outputDir, `${filename}.svg`);
            await QRCode.toFile(svgPath, data, { 
                ...options, 
                type: 'svg',
                margin: 4,
                errorCorrectionLevel: errorCorrection
            });
            results.svg = svgPath;

            return results;

        } catch (error) {
            throw new Error(`Failed to generate QR code: ${error.message}`);
        }
    }

    async generateCampaignQR(campaignName, sizePreset = 'digital') {
        if (!this.campaigns[campaignName]) {
            throw new Error(`Campaign '${campaignName}' not found. Available: ${Object.keys(this.campaigns).join(', ')}`);
        }

        const campaign = this.campaigns[campaignName];

        // Create redirect URL (GitHub Pages URL + campaign path)
        const redirectUrl = new URL(campaignName, this.baseUrl).href;

        // Generate QR code pointing to redirect URL
        const files = await this.generateQRCode(
            redirectUrl,
            `${campaignName}-qr`,
            sizePreset
        );

        console.log(`✅ Generated QR code for campaign '${campaignName}':`);
        console.log(`   📱 Redirect URL: ${redirectUrl}`);
        console.log(`   🎯 Final destination: ${campaign.destination}`);
        console.log(`   📁 Files:`, files);

        return files;
    }

    async generateAllCampaigns(sizePreset = 'digital') {
        const results = {};

        for (const campaignName of Object.keys(this.campaigns)) {
            try {
                results[campaignName] = await this.generateCampaignQR(campaignName, sizePreset);
            } catch (error) {
                console.error(`❌ Error generating QR for ${campaignName}:`, error.message);
            }
        }

        return results;
    }

    listCampaigns() {
        console.log('\n📋 Available Campaigns:');
        console.log('-'.repeat(50));

        Object.entries(this.campaigns).forEach(([name, config]) => {
            console.log(`🏷️  ${name}`);
            console.log(`   Destination: ${config.destination}`);
            console.log(`   UTM params:`, config.utmParams || 'None');
            console.log();
        });
    }

    listSizePresets() {
        console.log('\n📏 Available Size Presets:');
        console.log('-'.repeat(50));

        Object.entries(this.sizePresets).forEach(([name, config]) => {
            console.log(`📐 ${name}: ${config.description} (width: ${config.width}px)`);
        });
        console.log();
    }
}

// CLI Interface
program
    .name('qr-generator')
    .description('Generate professional QR codes for GitHub Pages hosting')
    .version('1.0.0');

program
    .option('--base-url <url>', 'Base URL for your GitHub Pages site', 'https://YOUR_USERNAME.github.io/qr-hosting/')
    .option('--campaign <name>', 'Generate QR for specific campaign')
    .option('--all', 'Generate QR codes for all campaigns')
    .option('--url <url>', 'Custom URL to generate QR code for')
    .option('--filename <name>', 'Custom filename (used with --url)')
    .option('--size <preset>', 'Size preset for the QR code', 'digital')
    .option('--error-correction <level>', 'Error correction level (L, M, Q, H)', 'Q')
    .option('--list-campaigns', 'List all available campaigns')
    .option('--list-sizes', 'List all available size presets');

program.parse();

const options = program.opts();

async function main() {
    const generator = new GitHubPagesQRGenerator(options.baseUrl);

    if (options.listCampaigns) {
        generator.listCampaigns();
        return;
    }

    if (options.listSizes) {
        generator.listSizePresets();
        return;
    }

    if (options.all) {
        console.log(`🚀 Generating QR codes for all campaigns (size: ${options.size})...`);
        await generator.generateAllCampaigns(options.size);
        return;
    }

    if (options.campaign) {
        await generator.generateCampaignQR(options.campaign, options.size);
        return;
    }

    if (options.url && options.filename) {
        const files = await generator.generateQRCode(
            options.url,
            options.filename,
            options.size,
            options.errorCorrection
        );
        console.log('✅ Generated custom QR code:');
        console.log(`   📱 URL: ${options.url}`);
        console.log('   📁 Files:', files);
        return;
    }

    // Default action - generate all campaigns
    console.log('🚀 No specific action specified. Generating all campaigns...');
    console.log('💡 Use --help to see all available options');
    await generator.generateAllCampaigns(options.size);
}

// Run the CLI
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Error:', error.message);
        process.exit(1);
    });
}

module.exports = GitHubPagesQRGenerator;
