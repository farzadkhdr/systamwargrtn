const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Admin system API URL
const ADMIN_API_URL = 'https://systamwargrtn.vercel.app/api';

// Temporary storage for local testing
let localRequests = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'سیستەمی ناردنی داواکاری چالاکە',
    timestamp: new Date().toISOString(),
    adminSystem: ADMIN_API_URL
  });
});

// Submit request to admin system
app.post('/api/requests', async (req, res) => {
  try {
    const requestData = req.body;
    
    // Validate required fields
    if (!requestData.name || !requestData.mobile) {
      return res.status(400).json({
        success: false,
        error: 'ناو و ژمارەی مۆبایل پێویستە'
      });
    }
    
    // Add metadata
    const requestWithMetadata = {
      id: uuidv4(),
      ...requestData,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    // Store locally
    localRequests.unshift(requestWithMetadata);
    
    // Try to forward to admin system
    try {
      const adminResponse = await fetch(`${ADMIN_API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestWithMetadata)
      });
      
      if (adminResponse.ok) {
        const adminResult = await adminResponse.json();
        
        return res.status(201).json({
          success: true,
          message: 'داواکاریەکەت بە سەرکەوتویی نێردرا بۆ سیستەمی بەڕێوەبردن!',
          data: requestWithMetadata,
          adminResponse: adminResult
        });
      }
    } catch (adminError) {
      console.log('Admin system is offline, storing locally:', adminError.message);
    }
    
    // If admin system is offline, still respond successfully with local storage
    res.status(201).json({
      success: true,
      message: 'داواکاریەکەت بە سەرکەوتویی نێردرا (لە سەرڤەری ناوخۆیی هەڵگیرا)',
      data: requestWithMetadata,
      note: 'کاتێک سیستەمی بەڕێوەبردن چالاک بێت، داواکاریەکان پێی دەنێردرێت'
    });
    
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە ناردنی داواکاری'
    });
  }
});

// Get advertisements from admin system
app.get('/api/advertisements', async (req, res) => {
  try {
    // Try to get from admin system first
    try {
      const adminResponse = await fetch(`${ADMIN_API_URL}/advertisements`);
      
      if (adminResponse.ok) {
        const adminResult = await adminResponse.json();
        
        // Track views for each ad
        if (adminResult.data && Array.isArray(adminResult.data)) {
          for (const ad of adminResult.data) {
            if (ad.id) {
              try {
                await fetch(`${ADMIN_API_URL}/advertisements/${ad.id}/view`, {
                  method: 'POST'
                });
              } catch (e) {
                // Ignore tracking errors
              }
            }
          }
        }
        
        return res.status(200).json({
          success: true,
          source: 'admin-system',
          data: adminResult.data
        });
      }
    } catch (adminError) {
      console.log('Admin system is offline, using sample ads:', adminError.message);
    }
    
    // If admin system is offline, return sample ads
    const sampleAds = [
      {
        id: uuidv4(),
        title: "فرۆشتنی خانوو لە شاری نوێ",
        description: "خانووی نوێ لە شاری نوێ بە نرخی تایبەت. هەموو خزمەتگوزاریەکان بەردەستە.",
        image: "/images/house1.jpg",
        link: "https://example.com/house1",
        status: "active",
        views: 150,
        clicks: 25,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: "فرۆشتنی زەوی لە بەختیاری",
        description: "زەوی بە قەبارەی گەورە لە بەختیاری. مۆڵەتی بنیاتنانی هەیە.",
        image: "/images/land1.jpg",
        status: "active",
        views: 89,
        clicks: 12,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: uuidv4(),
        title: "کڕینی خانوو لە گوڵان ستی",
        description: "خانووی کارتی نوێ لە گوڵان ستی بە نرخی مامناوەند.",
        image: "/images/house2.jpg",
        link: "https://example.com/house2",
        status: "active",
        views: 75,
        clicks: 18,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    
    res.status(200).json({
      success: true,
      source: 'local-cache',
      data: sampleAds
    });
    
  } catch (error) {
    console.error('Error getting advertisements:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی رێکلامەکان'
    });
  }
});

// Track advertisement click
app.post('/api/advertisements/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Forward to admin system if available
    try {
      await fetch(`${ADMIN_API_URL}/advertisements/${id}/click`, {
        method: 'POST'
      });
    } catch (adminError) {
      console.log('Admin system offline for click tracking');
    }
    
    res.status(200).json({
      success: true,
      message: 'کلیکەکە تۆمارکرا'
    });
    
  } catch (error) {
    console.error('Error tracking ad click:', error);
    res.status(500).json({
      success: false
    });
  }
});

// Get local requests (for testing)
app.get('/api/local-requests', (req, res) => {
  res.status(200).json({
    success: true,
    count: localRequests.length,
    data: localRequests
  });
});

// Get location suggestions
app.get('/api/locations', (req, res) => {
  const locations = [
    "شۆرش", "شارێ یۆنانی", "کوێستان(قادسیە)", "سێوەکە", "ئارام گاردن", "کانی", 
    "ئیمپایەر رۆیاڵ ئەپارتمێنت", "خوێندنی باڵا", "قەرەبوی کارێز", "کورانی نوێ", 
    "بەختیاری نوێ", "ئازادی بەحرکە", "برایەتی بەحرکە", "گوڵان ستی", 
    "کۆمەڵگەی ژین (بەحرکە)", "مەلا یاسین", "ڤێلاکانی ئۆکلاند", "ئەربیل گاردن", 
    "ڤانە تاوەرز", "ئۆلیڤ گاردن ستی", "بەحرکەی نوێ", "سەیدان B", "میراج ستی", 
    "خەرابەدراو", "دارەبەن", "فەرمان بەرانی (بەحرکە)", "ڕاستی (بەحرکە)", 
    "دارەتوی نوێ", "بنەسڵاوە", "ئاری", "دیلان", "99 زانکۆ", "زیلان ستی", 
    "94 باداوە", "کارێزان", "ئەدرێس ئەربیل", "بیڤرلی هیڵز", "سەربەستی نوێ (8ی تورەق)", 
    "سەیدان", "جیدە", "قۆپەقران", "ڵایف تاوەرز", "قەرەبووی کەلەکین", 
    "کرێچیانی شاوێس", "قەرەبووی شاوێس", "پیشەسازی باشور", "لالاڤ سەن تاوەرز", 
    "نیو ئیسکان", "نایس ڤیلەج", "کوین تاوەر", "شاری سانا", "چنار (شورتاوە)", 
    "407 عنکاوە", "حاکماوا", "عەنکاوە 128", "سیمی خاتوناوە", "121 گوڵان (گوڵان 1)", 
    "زانایان", "سەروەران", "پێشمەرگە (تاپۆ)", "ئاڵتون ستی", "سێبەردان 2", 
    "هەڤاڵان", "دارەتوو", "ئاڵاسکا تاوەرز", "کەڕک(تاپۆ)", "گەرەسۆری کارت", 
    "گەرەسۆر", "گەرەسۆری تەعجیل", "گوندی ئەمریکی", "هەواری شار", "دوبەی ستی", 
    "تیمار", "ڕووناکی", "موفتی", "ئەندازیاران", "مەنتکاوە", "شادی و بەهاری نوێ", 
    "منارە سیتی 2", "ماردین", "کوردستان", "ئایندە ستی 2", "ئایندە ستی 1", 
    "هەولێر ستی", "فلۆرێنس تاوەر", "سینترۆ تاوەر", "ئۆزال ستی", "هیران ستی", 
    "لانە ستی", "شاری ئەندازیاران", "ژیان ستی", "سەری بڵند", "ڕاستی (عەدالە)", 
    "لەندەن تاوەرز", "زەیتون ستی", "رۆشنبیری 1", "ئاشۆکان", "نەورۆز (حەی عەسکەری)", 
    "14 کونە گورگ", "مارینا 1", "مارینا 2", "مارینا 3", "فیوچەر ستی", 
    "پێشەنگ پلەس تاوەرز", "ماس ستی", "فلۆریا ستی", "شاری هەرشەم 3", "زێڕین ستی", 
    "ئۆلیڤ ستی", "قەرەبووی رەشکین (زەوییەکانی تێرمیناڵ)", "ڤارسان", "قەرەبوی گەنجان", 
    "زین ستی", "ژین", "کوردستان ستی", "نۆبڵ ستی", "فیردەوس ستی", 
    "شاری ژیانی (هاوچەرخ)", "ڤار پارک", "باغمرە شهاب", "دیپلۆماتی سەفیران", 
    "سلاڤا ستی", "پاڤلیۆن", "گەزنەی نوێ", "قەرەبووی گرد جوتیار", "بێریات", 
    "عەزە", "عارەب کەند", "هیوا ستی", "147 عنکاوە", "کانی قرژاڵە", "گرد جوتیار", 
    "هەولێری نوێ", "8 حەسارۆک", "5 حەسارۆک", "فەرمان بەران", "بەختیاری", 
    "وەزیران (پەرلەمان)", "گوندی زانکۆی نوێ", "مامۆستایانی زانکۆ", "شارەوانی"
  ];
  
  const query = req.query.q || '';
  
  if (query) {
    const filtered = locations.filter(loc => 
      loc.includes(query)
    );
    
    return res.status(200).json({
      success: true,
      query,
      count: filtered.length,
      data: filtered
    });
  }
  
  res.status(200).json({
    success: true,
    count: locations.length,
    data: locations
  });
});

// Get house sizes
app.get('/api/house-sizes', (req, res) => {
  const sizes = Array.from({ length: 30 }, (_, i) => {
    const size = 100 + (i * 25);
    return {
      value: size.toString(),
      label: `${size} م²`
    };
  });
  
  res.status(200).json({
    success: true,
    data: sizes
  });
});

// Sync local requests to admin system (background job)
async function syncRequestsToAdmin() {
  if (localRequests.length === 0) return;
  
  try {
    const unsyncedRequests = localRequests.filter(req => !req.syncedToAdmin);
    
    for (const request of unsyncedRequests) {
      try {
        const adminResponse = await fetch(`${ADMIN_API_URL}/requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        });
        
        if (adminResponse.ok) {
          request.syncedToAdmin = true;
          console.log(`Synced request ${request.id} to admin system`);
        }
      } catch (error) {
        console.log(`Failed to sync request ${request.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error in sync job:', error);
  }
}

// Run sync every 5 minutes
setInterval(syncRequestsToAdmin, 5 * 60 * 1000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'هەڵەی ناوخۆیی سێرڤەر',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'تۆڕگەی API نەدۆزرایەوە'
  });
});

// Serve static files from root
app.use(express.static('.'));

// Export app for Vercel
module.exports = app;
