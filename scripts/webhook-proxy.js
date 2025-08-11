#!/usr/bin/env node

/**
 * Simple webhook proxy server (free alternative to Zapier)
 * Receives webhooks from Zeffy and forwards to Strapi
 * 
 * Deploy this to any free service like:
 * - Vercel (free tier)
 * - Railway (free tier) 
 * - Render (free tier)
 * - Glitch (free)
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'https://best-desire-8443ae2768.strapiapp.com';
const WEBHOOK_SECRET = process.env.ZEFFY_WEBHOOK_SECRET || 'ZeffyWebhook2025SecureToken_LoveInAction_!@#$RandomString789xyz';

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Zeffy Webhook Proxy Active', timestamp: new Date().toISOString() });
});

// Webhook endpoint that Zeffy will call
app.post('/zeffy-webhook', async (req, res) => {
  console.log('📥 Received webhook from Zeffy:', req.body);
  
  try {
    // Transform Zeffy webhook data to expected format
    const zeffyData = req.body;
    
    // Map Zeffy data to Strapi format
    const strapiPayload = {
      transaction_id: zeffyData.id || zeffyData.transaction_id,
      amount: parseFloat(zeffyData.amount || 0),
      currency: zeffyData.currency || 'USD',
      frequency: zeffyData.recurring ? 'monthly' : 'one_time',
      created_at: zeffyData.created_at || new Date().toISOString(),
      form_name: zeffyData.form_name || 'Zeffy Donation',
      donor: {
        first_name: zeffyData.first_name || zeffyData.donor?.first_name || '',
        last_name: zeffyData.last_name || zeffyData.donor?.last_name || '',
        email: zeffyData.email || zeffyData.donor?.email || '',
        phone: zeffyData.phone || zeffyData.donor?.phone || ''
      },
      address: {
        line1: zeffyData.address || zeffyData.address?.line1 || '',
        city: zeffyData.city || zeffyData.address?.city || '',
        country: zeffyData.country || zeffyData.address?.country || 'US'
      },
      custom_questions: zeffyData.custom_questions || [],
      utm: {
        source: zeffyData.utm_source || '',
        medium: zeffyData.utm_medium || '',
        campaign: zeffyData.utm_campaign || ''
      }
    };

    console.log('🔄 Forwarding to Strapi:', strapiPayload);

    // Forward to Strapi webhook
    const response = await fetch(`${STRAPI_URL}/api/zeffy/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': WEBHOOK_SECRET
      },
      body: JSON.stringify(strapiPayload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Successfully forwarded to Strapi:', result);
      res.json({ success: true, strapi_response: result });
    } else {
      const error = await response.text();
      console.error('❌ Strapi error:', error);
      res.status(500).json({ error: 'Failed to forward to Strapi', details: error });
    }

  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Proxy processing failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Zeffy Webhook Proxy running on port ${PORT}`);
  console.log(`📥 Webhook URL: http://localhost:${PORT}/zeffy-webhook`);
  console.log(`🎯 Forwarding to: ${STRAPI_URL}/api/zeffy/webhook`);
});

module.exports = app;