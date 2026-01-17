const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Admin system API URL
const ADMIN_API_URL = 'https://systamwargrtn.vercel.app/api';

// Proxy endpoint for submitting requests to admin system
app.post('/api/submit-request', async (req, res) => {
  try {
    const requestData = req.body;
    
    // Validate required fields
    if (!requestData.name || !requestData.mobile) {
      return res.status(400).json({
        success: false,
        error: 'ناو و ژمارەی مۆبایل پێویستە'
      });
    }
    
    // Forward request to admin system
    const adminResponse = await fetch(`${ADMIN_API_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    const adminResult = await adminResponse.json();
    
    if (adminResult.success) {
      res.status(201).json({
        success: true,
        message: 'داواکاریەکەت بە سەرکەوتویی نێردرا!',
        data: adminResult.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: adminResult.error || 'هەڵە لە ناردنی داواکاری'
      });
    }
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({
      success: false,
      error: 'پەیوەندی بە سێرڤەرەوە شکستی هێنا'
    });
  }
});

// Get advertisements from admin system
app.get('/api/get-advertisements', async (req, res) => {
  try {
    const adminResponse = await fetch(`${ADMIN_API_URL}/advertisements`);
    const adminResult = await adminResponse.json();
    
    if (adminResult.success) {
      res.status(200).json({
        success: true,
        data: adminResult.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: adminResult.error || 'هەڵە لە وەرگرتنی رێکلامەکان'
      });
    }
  } catch (error) {
    console.error('Error getting advertisements:', error);
    res.status(500).json({
      success: false,
      error: 'پەیوەندی بە سێرڤەرەوە شکستی هێنا'
    });
  }
});

// Track advertisement view
app.post('/api/track-ad-view/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const adminResponse = await fetch(`${ADMIN_API_URL}/advertisements/${id}/view`, {
      method: 'POST'
    });
    
    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Error tracking ad view:', error);
    res.status(500).json({
      success: false
    });
  }
});

// Track advertisement click
app.post('/api/track-ad-click/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const adminResponse = await fetch(`${ADMIN_API_URL}/advertisements/${id}/click`, {
      method: 'POST'
    });
    
    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Error tracking ad click:', error);
    res.status(500).json({
      success: false
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'سیستەمی ناردنی داواکاری چالاکە',
    timestamp: new Date().toISOString(),
    adminSystem: ADMIN_API_URL
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'هەڵەی ناوخۆیی سێرڤەر'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'تۆڕگە نەدۆزرایەوە'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`سێرڤەری ناردنی داواکاری کار دەکات لە پۆرت ${PORT}`);
});

module.exports = app;
