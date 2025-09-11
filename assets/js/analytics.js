/**
 * GitHub Pages QR Analytics
 * Privacy-focused analytics for QR code campaigns
 */

(function() {
    'use strict';

    // Configuration
    const ANALYTICS_CONFIG = {
        enabled: true,
        debug: false, // Set to true for console logging
        googleAnalyticsId: null, // Set your GA4 ID: 'G-XXXXXXXXXX'
        plausibleDomain: null, // Set for Plausible: 'yourdomain.com'

        // Privacy settings
        respectDNT: true, // Respect Do Not Track
        anonymizeIP: true,
        cookieConsent: false // Set to true to require cookie consent
    };

    // Check for Do Not Track
    function respectsDoNotTrack() {
        return ANALYTICS_CONFIG.respectDNT && 
               (navigator.doNotTrack === '1' || 
                window.doNotTrack === '1' || 
                navigator.msDoNotTrack === '1');
    }

    // Debug logging
    function debugLog(message, data) {
        if (ANALYTICS_CONFIG.debug) {
            console.log('[QR Analytics]', message, data || '');
        }
    }

    // Get visitor information (privacy-safe)
    function getVisitorInfo() {
        return {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            path: window.location.pathname,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            language: navigator.language || navigator.userLanguage,
            screenSize: screen.width + 'x' + screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            platform: navigator.platform
        };
    }

    // Extract campaign info from URL/page
    function getCampaignInfo() {
        const path = window.location.pathname;
        const campaignMatch = path.match(/\/([^/]+)(?:\.html)?$/);
        const campaign = campaignMatch ? campaignMatch[1] : 'index';

        // Extract UTM parameters if present in destination URLs
        const scripts = document.querySelectorAll('script');
        let destination = null;

        scripts.forEach(script => {
            const content = script.textContent || script.innerText;
            const urlMatch = content.match(/https?:\/\/[^\s"']+/);
            if (urlMatch) {
                destination = urlMatch[0];
            }
        });

        return {
            campaign: campaign,
            destination: destination,
            qrCodeId: campaign
        };
    }

    // Google Analytics 4 integration
    function initGoogleAnalytics() {
        if (!ANALYTICS_CONFIG.googleAnalyticsId) return;

        // Load gtag
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.googleAnalyticsId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', ANALYTICS_CONFIG.googleAnalyticsId, {
            anonymize_ip: ANALYTICS_CONFIG.anonymizeIP,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
        });

        debugLog('Google Analytics initialized');
    }

    // Plausible Analytics integration
    function initPlausible() {
        if (!ANALYTICS_CONFIG.plausibleDomain) return;

        const script = document.createElement('script');
        script.defer = true;
        script.src = 'https://plausible.io/js/plausible.js';
        script.setAttribute('data-domain', ANALYTICS_CONFIG.plausibleDomain);
        document.head.appendChild(script);

        debugLog('Plausible Analytics initialized');
    }

    // Custom event tracking
    function trackEvent(eventName, eventCategory, eventData) {
        if (!ANALYTICS_CONFIG.enabled || respectsDoNotTrack()) {
            debugLog('Event tracking disabled or DNT detected');
            return;
        }

        const visitorInfo = getVisitorInfo();
        const campaignInfo = getCampaignInfo();

        const fullEventData = {
            event: eventName,
            category: eventCategory,
            ...visitorInfo,
            ...campaignInfo,
            ...eventData
        };

        debugLog('Tracking event:', fullEventData);

        // Google Analytics 4
        if (window.gtag && ANALYTICS_CONFIG.googleAnalyticsId) {
            gtag('event', eventName, {
                event_category: eventCategory,
                event_label: campaignInfo.campaign,
                custom_map: {
                    campaign_id: campaignInfo.qrCodeId,
                    destination_url: campaignInfo.destination
                }
            });
        }

        // Plausible Analytics
        if (window.plausible && ANALYTICS_CONFIG.plausibleDomain) {
            window.plausible(eventName, {
                props: {
                    category: eventCategory,
                    campaign: campaignInfo.campaign,
                    qr_id: campaignInfo.qrCodeId
                }
            });
        }

        // Console logging for development
        if (ANALYTICS_CONFIG.debug) {
            console.table(fullEventData);
        }
    }

    // Automatic page view tracking
    function trackPageView() {
        trackEvent('page_view', 'navigation', {
            page_title: document.title
        });
    }

    // Track QR scan simulation (when someone lands on redirect page)
    function trackQRScan() {
        const campaignInfo = getCampaignInfo();

        if (campaignInfo.campaign !== 'index') {
            trackEvent('qr_scan', 'campaign', {
                campaign_name: campaignInfo.campaign,
                destination_url: campaignInfo.destination
            });
        }
    }

    // Initialize analytics
    function init() {
        if (respectsDoNotTrack()) {
            debugLog('Do Not Track enabled - analytics disabled');
            return;
        }

        debugLog('Initializing QR Analytics');

        // Initialize third-party analytics
        if (ANALYTICS_CONFIG.googleAnalyticsId) {
            initGoogleAnalytics();
        }

        if (ANALYTICS_CONFIG.plausibleDomain) {
            initPlausible();
        }

        // Track initial page view
        trackPageView();

        // Track QR scan if this is a campaign page
        trackQRScan();

        debugLog('QR Analytics initialized');
    }

    // Public API
    window.QRAnalytics = {
        track: trackEvent,
        init: init,
        config: ANALYTICS_CONFIG
    };

    // Make trackEvent available globally for inline scripts
    window.trackEvent = trackEvent;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    debugLog('QR Analytics script loaded');
})();