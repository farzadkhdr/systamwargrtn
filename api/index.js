const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload setup for advertisements
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.mimetype.toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('جۆری فایل پەسەند نەکراوە. تکایە تەنها وێنە باربکە.'));
  }
});

// ========== DATA STORAGE ==========
// In production, use a database like MongoDB or PostgreSQL
let requests = [];
let houses = [];
let lands = [];
let advertisements = [];
let systemSettings = {
  apiUrl: 'https://systamwargrtn.vercel.app/api',
  companyName: 'کۆمپانیای فرۆشتنی خانوو و زەوی',
  adminEmail: 'admin@example.com',
  maxFileSize: 10,
  notificationEmail: 'notifications@example.com',
  autoRefreshInterval: 30,
  defaultCurrency: 'دینار',
  theme: 'light'
};

// ========== INITIALIZE SAMPLE DATA ==========
const initializeSampleData = () => {
  console.log('📊 Initializing sample data...');
  
  // Sample requests
  if (requests.length === 0) {
    requests = [
      {
        id: uuidv4(),
        name: "نەورۆز محەممەد",
        mobile: "07701234567",
        type: "فرۆشتنی خانوو",
        location: "شاری نوێ",
        size: "150 م²",
        price: "250,000,000",
        saleType: "تاپۆ",
        status: "new",
        notes: "خانووی نوێ بە سەربەستی تەواو",
        createdAt: moment().subtract(1, 'hour').toISOString(),
        updatedAt: moment().subtract(1, 'hour').toISOString()
      },
      {
        id: uuidv4(),
        name: "حەسەن عەلی",
        mobile: "07707654321",
        type: "کڕینی زەوی",
        location: "بەختیاری",
        size: "500 م²",
        price: "100,000,000",
        saleType: null,
        status: "processing",
        notes: "پێویستی بە زەویەکی بازاڕی هەیە",
        createdAt: moment().subtract(3, 'hours').toISOString(),
        updatedAt: moment().subtract(2, 'hours').toISOString()
      },
      {
        id: uuidv4(),
        name: "سارا عەبدوڵڵا",
        mobile: "07705556677",
        type: "فرۆشتنی خانوو",
        location: "گوڵان ستی",
        size: "200 م²",
        price: "350,000,000",
        saleType: "کارت",
        status: "accepted",
        notes: "خانووی کارتی نوێ لە پلەی ٥",
        createdAt: moment().subtract(1, 'days').toISOString(),
        updatedAt: moment().subtract(12, 'hours').toISOString()
      },
      {
        id: uuidv4(),
        name: "کەریم ئەحمەد",
        mobile: "07708889900",
        type: "فرۆشتنی زەوی",
        location: "قەرەبوی کارێز",
        size: "1000 م²",
        price: "500,000,000",
        saleType: null,
        status: "completed",
        notes: "فرۆشتنی زەوی بە سەرکەوتویی تەواو بوو",
        createdAt: moment().subtract(2, 'days').toISOString(),
        updatedAt: moment().subtract(1, 'days').toISOString()
      },
      {
        id: uuidv4(),
        name: "لەتیفە محەممەد",
        mobile: "07709991122",
        type: "کڕینی خانوو",
        location: "هەولێر ستی",
        size: "175 م²",
        price: "280,000,000",
        saleType: "تاپۆ",
        status: "rejected",
        notes: "نرخی داواکراو زۆر بەرزە",
        createdAt: moment().subtract(4, 'days').toISOString(),
        updatedAt: moment().subtract(3, 'days').toISOString()
      }
    ];
    console.log(`✅ ${requests.length} sample requests initialized`);
  }

  // Sample houses
  if (houses.length === 0) {
    houses = [
      {
        id: uuidv4(),
        owner: "عەبدوڵڵا کەریم",
        mobile: "07701112233",
        location: "شاری سانا",
        type: "تاپۆ",
        size: "200 م²",
        price: "300,000,000",
        description: "خانووی نوێ بە سەربەستی تەواو، ٣ ژوور، ٢ حەمام",
        status: "available",
        createdAt: moment().subtract(5, 'days').toISOString(),
        updatedAt: moment().subtract(5, 'days').toISOString()
      },
      {
        id: uuidv4(),
        owner: "زەینەب مەحموود",
        mobile: "07702223344",
        location: "گوڵان ستی",
        type: "کارت",
        size: "175 م²",
        price: "280,000,000",
        description: "خانووی کارتی لە پلەی ٨، دیمەنی جوان",
        status: "فرۆشراو",
        soldDate: moment().subtract(10, 'days').toISOString(),
        soldPrice: "275,000,000",
        createdAt: moment().subtract(30, 'days').toISOString(),
        updatedAt: moment().subtract(10, 'days').toISOString()
      },
      {
        id: uuidv4(),
        owner: "کەمال محەممەد",
        mobile: "07703334455",
        location: "هەولێر ستی",
        type: "تاپۆ",
        size: "250 م²",
        price: "400,000,000",
        description: "خانووی گەورە بە باخچەیەکی جوان، ٤ ژوور",
        status: "available",
        createdAt: moment().subtract(15, 'days').toISOString(),
        updatedAt: moment().subtract(15, 'days').toISOString()
      },
      {
        id: uuidv4(),
        owner: "سەلام عەلی",
        mobile: "07704445566",
        location: "ئەربیل گاردن",
        type: "کارت",
        size: "150 م²",
        price: "220,000,000",
        description: "خانووی کارتی نوێ، دەستی یەکەم",
        status: "available",
        createdAt: moment().subtract(7, 'days').toISOString(),
        updatedAt: moment().subtract(7, 'days').toISOString()
      }
    ];
    console.log(`✅ ${houses.length} sample houses initialized`);
  }

  // Sample lands
  if (lands.length === 0) {
    lands = [
      {
        id: uuidv4(),
        owner: "سەلام عەبدوڵڵا",
        mobile: "07704445566",
        location: "قەرەبوی کارێز",
        size: "1000 م²",
        price: "500,000,000",
        description: "زەوی بازاڕی لە شوێنی ستراتیژی",
        status: "available",
        createdAt: moment().subtract(20, 'days').toISOString(),
        updatedAt: moment().subtract(20, 'days').toISOString()
      },
      {
        id: uuidv4(),
        owner: "ڕەشاد عەلی",
        mobile: "07707778899",
        location: "بەختیاری",
        size: "2000 م²",
        price: "800,000,000",
        description: "زەوی کشتوکاڵی لە ناوچەی ئاواوی",
        status: "فرۆشراو",
        soldDate: moment().subtract(25, 'days').toISOString(),
        soldPrice: "780,000,000",
        createdAt: moment().subtract(40, 'days').toISOString(),
        updatedAt: moment().subtract(25, 'days').toISOString()
      },
      {
        id: uuidv4(),
        owner: "نازێن عوسمان",
        mobile: "07706667788",
        location: "گرد جوتیار",
        size: "1500 م²",
        price: "600,000,000",
        description: "زەوی بیناسازی لە ناوچەی گەشەسەندوو",
        status: "available",
        createdAt: moment().subtract(12, 'days').toISOString(),
        updatedAt: moment().subtract(12, 'days').toISOString()
      }
    ];
    console.log(`✅ ${lands.length} sample lands initialized`);
  }

  // Sample advertisements
  if (advertisements.length === 0) {
    advertisements = [
      {
        id: uuidv4(),
        title: "فرۆشتنی خانوو لە شاری نوێ",
        description: "خانووی نوێ لە شاری نوێ بە نرخی تایبەت. هەموو خزمەتگوزاریەکان بەردەستە. ژووری ٣، حەمام ٢، گەرەجی داخراو.",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "https://example.com/house1",
        status: "active",
        views: 150,
        clicks: 25,
        createdAt: moment().subtract(2, 'days').toISOString(),
        updatedAt: moment().subtract(2, 'days').toISOString()
      },
      {
        id: uuidv4(),
        title: "فرۆشتنی زەوی لە بەختیاری",
        description: "زەوی بە قەبارەی گەورە لە بەختیاری. مۆڵەتی بنیاتنانی هەیە. نزیک بە ڕێگای سەرەکی.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80",
        status: "active",
        views: 89,
        clicks: 12,
        createdAt: moment().subtract(5, 'days').toISOString(),
        updatedAt: moment().subtract(5, 'days').toISOString()
      },
      {
        id: uuidv4(),
        title: "کڕینی خانوو لە گوڵان ستی",
        description: "خانووی کارتی نوێ لە گوڵان ستی بە نرخی مامناوەند. ئامادەیە بۆ کڕین یان کرێ.",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "https://example.com/house2",
        status: "inactive",
        views: 75,
        clicks: 18,
        createdAt: moment().subtract(10, 'days').toISOString(),
        updatedAt: moment().subtract(3, 'days').toISOString()
      },
      {
        id: uuidv4(),
        title: "فرۆشتنی خانووی تاپۆ لە هەولێر ستی",
        description: "خانووی تاپۆی گەورە بە باخچەیەکی جوان. ٤ ژوور، ٣ حەمام، گەرەجی ٢ ئوتومبیل.",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        status: "active",
        views: 210,
        clicks: 45,
        createdAt: moment().subtract(1, 'days').toISOString(),
        updatedAt: moment().subtract(1, 'days').toISOString()
      }
    ];
    console.log(`✅ ${advertisements.length} sample advertisements initialized`);
  }

  console.log('📊 Sample data initialization complete!');
};

// Initialize data
initializeSampleData();

// ========== HELPER FUNCTIONS ==========
const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

const formatDateKurdish = (date) => {
  return moment(date).locale('ku').format('dddd، D MMMM YYYY - HH:mm');
};

const formatPrice = (price) => {
  if (!price) return '';
  const num = parseInt(price.toString().replace(/,/g, ''), 10);
  if (isNaN(num)) return price;
  return num.toLocaleString('ku') + ' دینار';
};

const getStatusBadge = (status) => {
  const statusMap = {
    'new': { class: 'status-new', text: 'نوێ' },
    'processing': { class: 'status-processing', text: 'لە کاردایە' },
    'accepted': { class: 'status-completed', text: 'وەرگیراو' },
    'completed': { class: 'status-completed', text: 'تەواو' },
    'rejected': { class: 'status-rejected', text: 'ڕەتکراو' },
    'available': { class: 'status-new', text: 'بەردەستە' },
    'فرۆشراو': { class: 'status-completed', text: 'فرۆشراو' },
    'sold': { class: 'status-completed', text: 'فرۆشراو' },
    'reserved': { class: 'status-processing', text: 'پارێزراو' },
    'active': { class: 'status-completed', text: 'چالاک' },
    'inactive': { class: 'status-processing', text: 'ناچالاک' }
  };
  
  return statusMap[status] || { class: 'status-processing', text: status };
};

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'سیستەمی وەرگرتنی داواکاری چالاکە 🟢',
    timestamp: moment().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    data: {
      requests: requests.length,
      houses: houses.length,
      lands: lands.length,
      advertisements: advertisements.length
    }
  });
});

// ========== REQUESTS ENDPOINTS ==========
// GET all requests with filtering and pagination
app.get('/api/requests', (req, res) => {
  try {
    const { 
      status, 
      type, 
      search,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filteredRequests = [...requests];

    // Apply filters
    if (status) {
      filteredRequests = filteredRequests.filter(req => req.status === status);
    }

    if (type) {
      filteredRequests = filteredRequests.filter(req => req.type === type);
    }

    // Search by name, mobile, or location
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRequests = filteredRequests.filter(req => 
        req.name?.toLowerCase().includes(searchLower) ||
        req.mobile?.includes(search) ||
        req.location?.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (startDate) {
      const start = moment(startDate).startOf('day');
      filteredRequests = filteredRequests.filter(req => 
        moment(req.createdAt).isSameOrAfter(start)
      );
    }

    if (endDate) {
      const end = moment(endDate).endOf('day');
      filteredRequests = filteredRequests.filter(req => 
        moment(req.createdAt).isSameOrBefore(end)
      );
    }

    // Sorting
    filteredRequests.sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    // Format dates for response
    const formattedRequests = paginatedRequests.map(req => ({
      ...req,
      createdAtFormatted: formatDateKurdish(req.createdAt),
      updatedAtFormatted: formatDateKurdish(req.updatedAt),
      statusBadge: getStatusBadge(req.status),
      priceFormatted: formatPrice(req.price)
    }));

    res.status(200).json({
      success: true,
      count: filteredRequests.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredRequests.length / parseInt(limit)),
        totalItems: filteredRequests.length,
        hasNext: endIndex < filteredRequests.length,
        hasPrev: startIndex > 0
      },
      data: formattedRequests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی داواکاریەکان'
    });
  }
});

// GET single request by ID
app.get('/api/requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const request = requests.find(req => req.id === id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'داواکاری نەدۆزرایەوە'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...request,
        createdAtFormatted: formatDateKurdish(request.createdAt),
        updatedAtFormatted: formatDateKurdish(request.updatedAt),
        statusBadge: getStatusBadge(request.status),
        priceFormatted: formatPrice(request.price)
      }
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی داواکاری'
    });
  }
});

// POST new request (from request submission system)
app.post('/api/requests', (req, res) => {
  try {
    const { name, mobile, type, location, size, price, saleType, notes } = req.body;

    // Validation
    if (!name || !mobile || !type) {
      return res.status(400).json({
        success: false,
        error: 'ناو، مۆبایل و جۆری داواکاری پێویستە'
      });
    }

    // Validate mobile format (Kurdish/Iraqi)
    const mobileRegex = /^07[7-9]\d{8}$/;
    const cleanMobile = mobile.replace(/\s+/g, '');
    if (!mobileRegex.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        error: 'ژمارەی مۆبایل نادروستە. پێویستە بە 07[7-9] دەستپێبکات و 10 ژمارە بێت.'
      });
    }

    const newRequest = {
      id: uuidv4(),
      name,
      mobile: cleanMobile,
      type,
      location: location || '',
      size: size || '',
      price: price || '',
      saleType: saleType || '',
      notes: notes || '',
      status: 'new',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    };

    requests.unshift(newRequest);

    console.log(`✅ New request created: ${newRequest.name} - ${newRequest.type}`);

    res.status(201).json({
      success: true,
      message: 'داواکاری بە سەرکەوتویی نێردرا 🎉',
      data: {
        ...newRequest,
        createdAtFormatted: formatDateKurdish(newRequest.createdAt),
        statusBadge: getStatusBadge(newRequest.status),
        priceFormatted: formatPrice(newRequest.price)
      }
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە دروستکردنی داواکاری'
    });
  }
});

// UPDATE request status
app.put('/api/requests/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const requestIndex = requests.findIndex(req => req.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'داواکاری نەدۆزرایەوە'
      });
    }

    // Validate status
    const validStatuses = ['new', 'processing', 'accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'دۆخی نادروست. دۆخە پەسەندکراوەکان: new, processing, accepted, rejected, completed'
      });
    }

    const oldStatus = requests[requestIndex].status;
    requests[requestIndex].status = status;
    requests[requestIndex].updatedAt = moment().toISOString();
    
    if (adminNotes) {
      requests[requestIndex].adminNotes = adminNotes;
    }

    console.log(`📝 Request ${id} status updated: ${oldStatus} → ${status}`);

    res.status(200).json({
      success: true,
      message: 'دۆخی داواکاری نوێکرایەوە ✅',
      data: {
        ...requests[requestIndex],
        createdAtFormatted: formatDateKurdish(requests[requestIndex].createdAt),
        updatedAtFormatted: formatDateKurdish(requests[requestIndex].updatedAt),
        statusBadge: getStatusBadge(status),
        priceFormatted: formatPrice(requests[requestIndex].price)
      }
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە نوێکردنەوەی دۆخی داواکاری'
    });
  }
});

// UPDATE request
app.put('/api/requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const requestIndex = requests.findIndex(req => req.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'داواکاری نەدۆزرایەوە'
      });
    }

    // Don't allow updating ID
    delete updateData.id;
    
    requests[requestIndex] = {
      ...requests[requestIndex],
      ...updateData,
      updatedAt: moment().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'داواکاری نوێکرایەوە ✅',
      data: {
        ...requests[requestIndex],
        createdAtFormatted: formatDateKurdish(requests[requestIndex].createdAt),
        updatedAtFormatted: formatDateKurdish(requests[requestIndex].updatedAt),
        statusBadge: getStatusBadge(requests[requestIndex].status),
        priceFormatted: formatPrice(requests[requestIndex].price)
      }
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە نوێکردنەوەی داواکاری'
    });
  }
});

// DELETE request
app.delete('/api/requests/:id', (req, res) => {
  try {
    const { id } = req.params;

    const requestIndex = requests.findIndex(req => req.id === id);

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'داواکاری نەدۆزرایەوە'
      });
    }

    const deletedRequest = requests.splice(requestIndex, 1)[0];

    console.log(`🗑️ Request deleted: ${deletedRequest.name} (${deletedRequest.id})`);

    res.status(200).json({
      success: true,
      message: 'داواکاری سڕایەوە ✅',
      data: deletedRequest
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە سڕینەوەی داواکاری'
    });
  }
});

// ========== HOUSES ENDPOINTS ==========
// GET all houses
app.get('/api/houses', (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 20 } = req.query;

    let filteredHouses = [...houses];

    if (status) {
      filteredHouses = filteredHouses.filter(house => house.status === status);
    }

    if (type) {
      filteredHouses = filteredHouses.filter(house => house.type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredHouses = filteredHouses.filter(house => 
        house.owner?.toLowerCase().includes(searchLower) ||
        house.location?.toLowerCase().includes(searchLower) ||
        house.mobile?.includes(search)
      );
    }

    // Sort by date (newest first)
    filteredHouses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedHouses = filteredHouses.slice(startIndex, endIndex);

    // Format response
    const formattedHouses = paginatedHouses.map(house => ({
      ...house,
      createdAtFormatted: formatDateKurdish(house.createdAt),
      updatedAtFormatted: formatDateKurdish(house.updatedAt),
      statusBadge: getStatusBadge(house.status),
      priceFormatted: formatPrice(house.price)
    }));

    res.status(200).json({
      success: true,
      count: filteredHouses.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredHouses.length / parseInt(limit)),
        totalItems: filteredHouses.length
      },
      data: formattedHouses
    });
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی خانووەکان'
    });
  }
});

// POST new house
app.post('/api/houses', (req, res) => {
  try {
    const { owner, mobile, location, type, size, price, description } = req.body;

    if (!owner || !mobile || !location || !price) {
      return res.status(400).json({
        success: false,
        error: 'خاوەن، مۆبایل، شوێن و نرخ پێویستە'
      });
    }

    const newHouse = {
      id: uuidv4(),
      owner,
      mobile,
      location,
      type: type || 'تاپۆ',
      size: size || '',
      price,
      description: description || '',
      status: 'available',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    };

    houses.unshift(newHouse);

    console.log(`✅ New house added: ${newHouse.owner} - ${newHouse.location}`);

    res.status(201).json({
      success: true,
      message: 'خانوو بە سەرکەوتویی زیادکرا 🏠',
      data: {
        ...newHouse,
        createdAtFormatted: formatDateKurdish(newHouse.createdAt),
        statusBadge: getStatusBadge(newHouse.status),
        priceFormatted: formatPrice(newHouse.price)
      }
    });
  } catch (error) {
    console.error('Error creating house:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە دروستکردنی خانوو'
    });
  }
});

// UPDATE house status
app.put('/api/houses/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const houseIndex = houses.findIndex(house => house.id === id);

    if (houseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'خانوو نەدۆزرایەوە'
      });
    }

    const oldStatus = houses[houseIndex].status;
    houses[houseIndex].status = status;
    houses[houseIndex].updatedAt = moment().toISOString();

    // If marking as sold, add sold date
    if (status === 'فرۆشراو' || status === 'sold') {
      houses[houseIndex].soldDate = moment().toISOString();
      houses[houseIndex].soldPrice = houses[houseIndex].price;
    }

    console.log(`📝 House ${id} status updated: ${oldStatus} → ${status}`);

    res.status(200).json({
      success: true,
      message: 'دۆخی خانوو نوێکرایەوە ✅',
      data: {
        ...houses[houseIndex],
        createdAtFormatted: formatDateKurdish(houses[houseIndex].createdAt),
        updatedAtFormatted: formatDateKurdish(houses[houseIndex].updatedAt),
        statusBadge: getStatusBadge(status),
        priceFormatted: formatPrice(houses[houseIndex].price)
      }
    });
  } catch (error) {
    console.error('Error updating house status:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە نوێکردنەوەی دۆخی خانوو'
    });
  }
});

// DELETE house
app.delete('/api/houses/:id', (req, res) => {
  try {
    const { id } = req.params;

    const houseIndex = houses.findIndex(house => house.id === id);

    if (houseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'خانوو نەدۆزرایەوە'
      });
    }

    const deletedHouse = houses.splice(houseIndex, 1)[0];

    console.log(`🗑️ House deleted: ${deletedHouse.owner} (${deletedHouse.id})`);

    res.status(200).json({
      success: true,
      message: 'خانوو سڕایەوە ✅',
      data: deletedHouse
    });
  } catch (error) {
    console.error('Error deleting house:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە سڕینەوەی خانوو'
    });
  }
});

// ========== LANDS ENDPOINTS ==========
// GET all lands
app.get('/api/lands', (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    let filteredLands = [...lands];

    if (status) {
      filteredLands = filteredLands.filter(land => land.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredLands = filteredLands.filter(land => 
        land.owner?.toLowerCase().includes(searchLower) ||
        land.location?.toLowerCase().includes(searchLower) ||
        land.mobile?.includes(search)
      );
    }

    // Sort by date (newest first)
    filteredLands.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedLands = filteredLands.slice(startIndex, endIndex);

    // Format response
    const formattedLands = paginatedLands.map(land => ({
      ...land,
      createdAtFormatted: formatDateKurdish(land.createdAt),
      updatedAtFormatted: formatDateKurdish(land.updatedAt),
      statusBadge: getStatusBadge(land.status),
      priceFormatted: formatPrice(land.price)
    }));

    res.status(200).json({
      success: true,
      count: filteredLands.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredLands.length / parseInt(limit)),
        totalItems: filteredLands.length
      },
      data: formattedLands
    });
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی زەویەکان'
    });
  }
});

// POST new land
app.post('/api/lands', (req, res) => {
  try {
    const { owner, mobile, location, size, price, description } = req.body;

    if (!owner || !mobile || !location || !price) {
      return res.status(400).json({
        success: false,
        error: 'خاوەن، مۆبایل، شوێن و نرخ پێویستە'
      });
    }

    const newLand = {
      id: uuidv4(),
      owner,
      mobile,
      location,
      size: size || '',
      price,
      description: description || '',
      status: 'available',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    };

    lands.unshift(newLand);

    console.log(`✅ New land added: ${newLand.owner} - ${newLand.location}`);

    res.status(201).json({
      success: true,
      message: 'زەوی بە سەرکەوتویی زیادکرا 🌄',
      data: {
        ...newLand,
        createdAtFormatted: formatDateKurdish(newLand.createdAt),
        statusBadge: getStatusBadge(newLand.status),
        priceFormatted: formatPrice(newLand.price)
      }
    });
  } catch (error) {
    console.error('Error creating land:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە دروستکردنی زەوی'
    });
  }
});

// UPDATE land status
app.put('/api/lands/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const landIndex = lands.findIndex(land => land.id === id);

    if (landIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'زەوی نەدۆزرایەوە'
      });
    }

    const oldStatus = lands[landIndex].status;
    lands[landIndex].status = status;
    lands[landIndex].updatedAt = moment().toISOString();

    // If marking as sold, add sold date
    if (status === 'فرۆشراو' || status === 'sold') {
      lands[landIndex].soldDate = moment().toISOString();
      lands[landIndex].soldPrice = lands[landIndex].price;
    }

    console.log(`📝 Land ${id} status updated: ${oldStatus} → ${status}`);

    res.status(200).json({
      success: true,
      message: 'دۆخی زەوی نوێکرایەوە ✅',
      data: {
        ...lands[landIndex],
        createdAtFormatted: formatDateKurdish(lands[landIndex].createdAt),
        updatedAtFormatted: formatDateKurdish(lands[landIndex].updatedAt),
        statusBadge: getStatusBadge(status),
        priceFormatted: formatPrice(lands[landIndex].price)
      }
    });
  } catch (error) {
    console.error('Error updating land status:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە نوێکردنەوەی دۆخی زەوی'
    });
  }
});

// DELETE land
app.delete('/api/lands/:id', (req, res) => {
  try {
    const { id } = req.params;

    const landIndex = lands.findIndex(land => land.id === id);

    if (landIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'زەوی نەدۆزرایەوە'
      });
    }

    const deletedLand = lands.splice(landIndex, 1)[0];

    console.log(`🗑️ Land deleted: ${deletedLand.owner} (${deletedLand.id})`);

    res.status(200).json({
      success: true,
      message: 'زەوی سڕایەوە ✅',
      data: deletedLand
    });
  } catch (error) {
    console.error('Error deleting land:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە سڕینەوەی زەوی'
    });
  }
});

// ========== ADVERTISEMENTS ENDPOINTS ==========
// GET all advertisements
app.get('/api/advertisements', (req, res) => {
  try {
    const { status, activeOnly = 'false', page = 1, limit = 20 } = req.query;

    let filteredAds = [...advertisements];

    if (status) {
      filteredAds = filteredAds.filter(ad => ad.status === status);
    }

    if (activeOnly === 'true') {
      filteredAds = filteredAds.filter(ad => ad.status === 'active');
    }

    // Sort by date (newest first)
    filteredAds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedAds = filteredAds.slice(startIndex, endIndex);

    // Format response
    const formattedAds = paginatedAds.map(ad => ({
      ...ad,
      createdAtFormatted: formatDateKurdish(ad.createdAt),
      updatedAtFormatted: formatDateKurdish(ad.updatedAt),
      statusBadge: getStatusBadge(ad.status)
    }));

    res.status(200).json({
      success: true,
      count: filteredAds.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredAds.length / parseInt(limit)),
        totalItems: filteredAds.length
      },
      data: formattedAds
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی رێکلامەکان'
    });
  }
});

// POST new advertisement
app.post('/api/advertisements', upload.single('image'), (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'سەردێری رێکلام پێویستە'
      });
    }

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      // In production, upload to cloud storage (S3, Cloudinary, etc.)
      // For demo purposes, we'll use a placeholder
      imageUrl = `https://via.placeholder.com/800x400/4a6fa5/ffffff?text=${encodeURIComponent(title)}`;
      
      console.log(`📸 Image uploaded for ad: ${req.file.originalname} (${req.file.size} bytes)`);
    } else {
      // Default placeholder image
      imageUrl = `https://via.placeholder.com/800x400/4a6fa5/ffffff?text=${encodeURIComponent(title)}`;
    }

    const newAd = {
      id: uuidv4(),
      title,
      description: description || '',
      image: imageUrl,
      link: link || '',
      status: 'active',
      views: 0,
      clicks: 0,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    };

    advertisements.unshift(newAd);

    console.log(`✅ New advertisement created: ${newAd.title}`);

    res.status(201).json({
      success: true,
      message: 'رێکلام بە سەرکەوتویی نێردرا 📢',
      data: {
        ...newAd,
        createdAtFormatted: formatDateKurdish(newAd.createdAt),
        statusBadge: getStatusBadge(newAd.status)
      }
    });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'هەڵە لە دروستکردنی رێکلام'
    });
  }
});

// GET single advertisement
app.get('/api/advertisements/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ad = advertisements.find(a => a.id === id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'رێکلام نەدۆزرایەوە'
      });
    }

    // Increment view count
    const adIndex = advertisements.findIndex(a => a.id === id);
    if (adIndex !== -1) {
      advertisements[adIndex].views += 1;
      advertisements[adIndex].updatedAt = moment().toISOString();
    }

    res.status(200).json({
      success: true,
      data: {
        ...ad,
        createdAtFormatted: formatDateKurdish(ad.createdAt),
        updatedAtFormatted: formatDateKurdish(ad.updatedAt),
        statusBadge: getStatusBadge(ad.status)
      }
    });
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی رێکلام'
    });
  }
});

// UPDATE advertisement status
app.put('/api/advertisements/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const adIndex = advertisements.findIndex(ad => ad.id === id);

    if (adIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'رێکلام نەدۆزرایەوە'
      });
    }

    const oldStatus = advertisements[adIndex].status;
    advertisements[adIndex].status = status;
    advertisements[adIndex].updatedAt = moment().toISOString();

    console.log(`📝 Advertisement ${id} status updated: ${oldStatus} → ${status}`);

    res.status(200).json({
      success: true,
      message: 'دۆخی رێکلام نوێکرایەوە ✅',
      data: {
        ...advertisements[adIndex],
        createdAtFormatted: formatDateKurdish(advertisements[adIndex].createdAt),
        updatedAtFormatted: formatDateKurdish(advertisements[adIndex].updatedAt),
        statusBadge: getStatusBadge(status)
      }
    });
  } catch (error) {
    console.error('Error updating advertisement status:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە نوێکردنەوەی دۆخی رێکلام'
    });
  }
});

// TRACK advertisement click
app.post('/api/advertisements/:id/click', (req, res) => {
  try {
    const { id } = req.params;

    const adIndex = advertisements.findIndex(ad => ad.id === id);

    if (adIndex !== -1) {
      advertisements[adIndex].clicks += 1;
      advertisements[adIndex].updatedAt = moment().toISOString();
    }

    res.status(200).json({
      success: true,
      message: 'کلیکەکە تۆمارکرا 👆'
    });
  } catch (error) {
    console.error('Error tracking ad click:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە تۆمارکردنی کلیک'
    });
  }
});

// DELETE advertisement
app.delete('/api/advertisements/:id', (req, res) => {
  try {
    const { id } = req.params;

    const adIndex = advertisements.findIndex(ad => ad.id === id);

    if (adIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'رێکلام نەدۆزرایەوە'
      });
    }

    const deletedAd = advertisements.splice(adIndex, 1)[0];

    console.log(`🗑️ Advertisement deleted: ${deletedAd.title} (${deletedAd.id})`);

    res.status(200).json({
      success: true,
      message: 'رێکلام سڕایەوە ✅',
      data: deletedAd
    });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە سڕینەوەی رێکلام'
    });
  }
});

// ========== DASHBOARD ENDPOINTS ==========
// GET dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const last7Days = moment().subtract(7, 'days').startOf('day');
    const last30Days = moment().subtract(30, 'days').startOf('day');

    // Today's requests
    const todayRequests = requests.filter(req => 
      moment(req.createdAt).isSameOrAfter(today)
    ).length;

    // Yesterday's requests
    const yesterdayRequests = requests.filter(req => 
      moment(req.createdAt).isSameOrAfter(yesterday) && 
      moment(req.createdAt).isBefore(today)
    ).length;

    // Last 7 days requests
    const last7DaysRequests = requests.filter(req => 
      moment(req.createdAt).isSameOrAfter(last7Days)
    ).length;

    // Last 30 days requests
    const last30DaysRequests = requests.filter(req => 
      moment(req.createdAt).isSameOrAfter(last30Days)
    ).length;

    // Status counts
    const newRequests = requests.filter(req => req.status === 'new').length;
    const processingRequests = requests.filter(req => req.status === 'processing').length;
    const completedRequests = requests.filter(req => req.status === 'completed' || req.status === 'accepted').length;

    // Property counts
    const availableHouses = houses.filter(house => house.status === 'available').length;
    const soldHouses = houses.filter(house => 
      house.status === 'فرۆشراو' || house.status === 'sold'
    ).length;

    const availableLands = lands.filter(land => land.status === 'available').length;
    const soldLands = lands.filter(land => 
      land.status === 'فرۆشراو' || land.status === 'sold'
    ).length;

    // Advertisement counts
    const activeAds = advertisements.filter(ad => ad.status === 'active').length;
    const totalAdViews = advertisements.reduce((sum, ad) => sum + (ad.views || 0), 0);
    const totalAdClicks = advertisements.reduce((sum, ad) => sum + (ad.clicks || 0), 0);

    // Recent activity (last 5 items)
    const recentRequests = [...requests]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(req => ({
        id: req.id,
        name: req.name,
        type: req.type,
        status: req.status,
        time: moment(req.createdAt).fromNow(),
        statusBadge: getStatusBadge(req.status)
      }));

    const recentHouses = [...houses]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(house => ({
        id: house.id,
        owner: house.owner,
        location: house.location,
        price: formatPrice(house.price),
        time: moment(house.createdAt).fromNow(),
        statusBadge: getStatusBadge(house.status)
      }));

    res.status(200).json({
      success: true,
      data: {
        // Request statistics
        requests: {
          total: requests.length,
          today: todayRequests,
          yesterday: yesterdayRequests,
          last7Days: last7DaysRequests,
          last30Days: last30DaysRequests,
          new: newRequests,
          processing: processingRequests,
          completed: completedRequests,
          rejected: requests.filter(req => req.status === 'rejected').length
        },
        
        // Property statistics
        properties: {
          houses: {
            total: houses.length,
            available: availableHouses,
            sold: soldHouses
          },
          lands: {
            total: lands.length,
            available: availableLands,
            sold: soldLands
          }
        },
        
        // Advertisement statistics
        advertisements: {
          total: advertisements.length,
          active: activeAds,
          inactive: advertisements.length - activeAds,
          totalViews: totalAdViews,
          totalClicks: totalAdClicks,
          clickRate: totalAdViews > 0 ? ((totalAdClicks / totalAdViews) * 100).toFixed(2) : 0
        },
        
        // Recent activity
        recentActivity: {
          requests: recentRequests,
          houses: recentHouses
        },
        
        // Performance metrics
        performance: {
          acceptanceRate: requests.length > 0 ? 
            ((completedRequests / requests.length) * 100).toFixed(2) : 0,
          avgResponseTime: '24h', // In a real app, calculate actual response time
          satisfactionRate: '92%' // Example metric
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی ئاماری داشبۆرد'
    });
  }
});

// GET today's requests
app.get('/api/dashboard/today-requests', (req, res) => {
  try {
    const today = moment().startOf('day');
    
    const todayRequests = requests
      .filter(req => moment(req.createdAt).isSameOrAfter(today))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(req => ({
        ...req,
        timeAgo: moment(req.createdAt).fromNow(),
        createdAtFormatted: formatDateKurdish(req.createdAt),
        statusBadge: getStatusBadge(req.status),
        priceFormatted: formatPrice(req.price)
      }));

    res.status(200).json({
      success: true,
      count: todayRequests.length,
      data: todayRequests
    });
  } catch (error) {
    console.error('Error fetching today requests:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی داواکاریەکانی ئەمڕۆ'
    });
  }
});

// ========== SYSTEM SETTINGS ENDPOINTS ==========
// GET system settings
app.get('/api/settings', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: systemSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە وەرگرتنی ڕێکخستنەکان'
    });
  }
});

// UPDATE system settings
app.put('/api/settings', (req, res) => {
  try {
    const updates = req.body;
    
    systemSettings = {
      ...systemSettings,
      ...updates,
      updatedAt: moment().toISOString()
    };

    console.log('⚙️ System settings updated');

    res.status(200).json({
      success: true,
      message: 'ڕێکخستنەکان نوێکرانەوە ✅',
      data: systemSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە نوێکردنەوەی ڕێکخستنەکان'
    });
  }
});

// ========== EXPORT ENDPOINTS ==========
// Export requests to CSV
app.get('/api/export/requests', (req, res) => {
  try {
    const { format = 'csv', startDate, endDate, status } = req.query;
    
    let dataToExport = [...requests];
    
    // Apply filters
    if (status) {
      dataToExport = dataToExport.filter(req => req.status === status);
    }
    
    if (startDate) {
      const start = moment(startDate).startOf('day');
      dataToExport = dataToExport.filter(req => 
        moment(req.createdAt).isSameOrAfter(start)
      );
    }
    
    if (endDate) {
      const end = moment(endDate).endOf('day');
      dataToExport = dataToExport.filter(req => 
        moment(req.createdAt).isSameOrBefore(end)
      );
    }
    
    if (format === 'csv') {
      // Convert to CSV
      const headers = ['ناو', 'مۆبایل', 'جۆر', 'شوێن', 'قەبارە', 'نرخ', 'دۆخ', 'کات'];
      const rows = dataToExport.map(req => [
        req.name || '',
        req.mobile || '',
        req.type || '',
        req.location || '',
        req.size || '',
        req.price || '',
        getStatusBadge(req.status).text,
        formatDateKurdish(req.createdAt)
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=داواکاریەکان_${moment().format('YYYY-MM-DD')}.csv`);
      res.send(csvContent);
    } else {
      // Default to JSON
      res.status(200).json({
        success: true,
        count: dataToExport.length,
        data: dataToExport
      });
    }
  } catch (error) {
    console.error('Error exporting requests:', error);
    res.status(500).json({
      success: false,
      error: 'هەڵە لە هەناردەکردنی داواکاریەکان'
    });
  }
});

// ========== UTILITY ENDPOINTS ==========
// Get available request types
app.get('/api/utils/request-types', (req, res) => {
  const types = [
    { value: "فرۆشتنی خانوو", label: "فرۆشتنی خانوو", icon: "fa-house-user" },
    { value: "کڕینی خانوو", label: "کڕینی خانوو", icon: "fa-search-dollar" },
    { value: "فرۆشتنی زەوی", label: "فرۆشتنی زەوی", icon: "fa-mountain" },
    { value: "کڕینی زەوی", label: "کڕینی زەوی", icon: "fa-flag" }
  ];
  
  res.status(200).json({
    success: true,
    data: types
  });
});

// Get available house types
app.get('/api/utils/house-types', (req, res) => {
  const types = [
    { value: "تاپۆ", label: "تاپۆ", icon: "fa-building" },
    { value: "کارت", label: "کارت", icon: "fa-building" }
  ];
  
  res.status(200).json({
    success: true,
    data: types
  });
});

// Get status options
app.get('/api/utils/status-options', (req, res) => {
  const options = [
    { value: "new", label: "نوێ", color: "#3498db" },
    { value: "processing", label: "لە کاردایە", color: "#f39c12" },
    { value: "accepted", label: "وەرگیراو", color: "#27ae60" },
    { value: "rejected", label: "ڕەتکراو", color: "#e74c3c" },
    { value: "completed", label: "تەواو", color: "#2ecc71" }
  ];
  
  res.status(200).json({
    success: true,
    data: options
  });
});

// Get property status options
app.get('/api/utils/property-status-options', (req, res) => {
  const options = [
    { value: "available", label: "بەردەستە", color: "#3498db" },
    { value: "فرۆشراو", label: "فرۆشراو", color: "#27ae60" },
    { value: "reserved", label: "پارێزراو", color: "#f39c12" }
  ];
  
  res.status(200).json({
    success: true,
    data: options
  });
});

// Get advertisement status options
app.get('/api/utils/ad-status-options', (req, res) => {
  const options = [
    { value: "active", label: "چالاک", color: "#27ae60" },
    { value: "inactive", label: "ناچالاک", color: "#95a5a6" }
  ];
  
  res.status(200).json({
    success: true,
    data: options
  });
});

// ========== ERROR HANDLING ==========
// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'تۆڕگەی API نەدۆزرایەوە',
    path: req.originalUrl,
    method: req.method,
    timestamp: moment().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack);
  
  const statusCode = err.status || 500;
  const errorMessage = err.message || 'هەڵەی ناوخۆیی سێرڤەر';
  
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    timestamp: moment().toISOString(),
    path: req.originalUrl,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 3000;

// Export for Vercel
module.exports = app;

// Only start server if not in Vercel environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║   🚀 سیستەمی وەرگرتنی داواکاری                      ║
║   📊 API چالاکە لە پۆرت ${PORT}                     ║
║   🌐 API URL: http://localhost:${PORT}/api           ║
║   ✅ تاقیکردنەوەی تەندروستی: /api/health           ║
╚══════════════════════════════════════════════════════╝
    
📊 داتای نموونەیی:
   • ${requests.length} داواکاری
   • ${houses.length} خانوو
   • ${lands.length} زەوی
   • ${advertisements.length} رێکلام
    
🔗 لینکە گرنگەکان:
   • داشبۆرد: http://localhost:${PORT}
   • داواکاریەکان: http://localhost:${PORT}/api/requests
   • ئاماری داشبۆرد: http://localhost:${PORT}/api/dashboard/stats
   • رێکلامەکان: http://localhost:${PORT}/api/advertisements
    `);
  });
}