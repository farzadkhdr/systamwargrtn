const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 دەستپێکردنی تاقیکردنەوەی API...\n');

  try {
    // 1. تاقیکردنەوەی تەندروستی
    console.log('1. 🔍 تاقیکردنەوەی تەندروستی API...');
    const healthRes = await axios.get(`${API_BASE_URL}/health`);
    console.log('   ✅ تەندروستی:', healthRes.data.message);
    console.log('   📊 ئامارەکان:', healthRes.data.data);

    // 2. وەرگرتنی داواکاریەکان
    console.log('\n2. 📨 وەرگرتنی داواکاریەکان...');
    const requestsRes = await axios.get(`${API_BASE_URL}/requests`);
    console.log(`   ✅ گشتی: ${requestsRes.data.count} داواکاری`);
    console.log(`   📄 پەڕە: ${requestsRes.data.pagination.page}/${requestsRes.data.pagination.totalPages}`);

    // 3. وەرگرتنی ئاماری داشبۆرد
    console.log('\n3. 📊 وەرگرتنی ئاماری داشبۆرد...');
    const statsRes = await axios.get(`${API_BASE_URL}/dashboard/stats`);
    console.log(`   ✅ داواکاری ئەمڕۆ: ${statsRes.data.data.requests.today}`);
    console.log(`   🏠 خانووی بەردەست: ${statsRes.data.data.properties.houses.available}`);
    console.log(`   🌄 زەوی بەردەست: ${statsRes.data.data.properties.lands.available}`);
    console.log(`   📢 رێکلامی چالاک: ${statsRes.data.data.advertisements.active}`);

    // 4. وەرگرتنی رێکلامەکان
    console.log('\n4. 📢 وەرگرتنی رێکلامەکان...');
    const adsRes = await axios.get(`${API_BASE_URL}/advertisements`);
    console.log(`   ✅ گشتی: ${adsRes.data.count} رێکلام`);
    
    // 5. ناردنی داواکاریەکی نوێ
    console.log('\n5. 📝 ناردنی داواکاریەکی نوێ...');
    const newRequest = {
      name: "تاقیکەرەوە",
      mobile: "07799988877",
      type: "فرۆشتنی خانوو",
      location: "شاری نوێ",
      size: "200 م²",
      price: "300000000",
      saleType: "تاپۆ",
      notes: "تاقیکردنەوەی API"
    };
    
    const createRes = await axios.post(`${API_BASE_URL}/requests`, newRequest);
    console.log(`   ✅ دروستکرا: ${createRes.data.message}`);
    console.log(`   🆔 ID: ${createRes.data.data.id}`);

    // 6. تاقیکردنەوەی فیلتەرکردن
    console.log('\n6. 🔍 تاقیکردنەوەی فیلتەرکردنی داواکاریەکان...');
    const filteredRes = await axios.get(`${API_BASE_URL}/requests?status=new&limit=5`);
    console.log(`   ✅ داواکاری نوێ: ${filteredRes.data.count}`);
    
    // 7. تاقیکردنەوەی یوتیلیتیەکان
    console.log('\n7. 🛠️ تاقیکردنەوەی یوتیلیتیەکان...');
    const utilsRes = await axios.get(`${API_BASE_URL}/utils/request-types`);
    console.log(`   ✅ جۆرەکانی داواکاری: ${utilsRes.data.data.length}`);

    // 8. تاقیکردنەوەی ڕێکخستنەکان
    console.log('\n8. ⚙️ تاقیکردنەوەی ڕێکخستنەکان...');
    const settingsRes = await axios.get(`${API_BASE_URL}/settings`);
    console.log(`   ✅ ناوی کۆمپانیا: ${settingsRes.data.data.companyName}`);

    console.log('\n🎉 هەموو تاقیکردنەوەکان بە سەرکەوتویی تەواو بوون!');
    console.log('\n📋 کۆی تاقیکردنەوەکان:');
    console.log('   • تەندروستی API ✅');
    console.log('   • وەرگرتنی داواکاری ✅');
    console.log('   • ئاماری داشبۆرد ✅');
    console.log('   • وەرگرتنی رێکلام ✅');
    console.log('   • ناردنی داواکاری نوێ ✅');
    console.log('   • فیلتەرکردن ✅');
    console.log('   • یوتیلیتیەکان ✅');
    console.log('   • ڕێکخستنەکان ✅');

  } catch (error) {
    console.error('❌ هەڵە لە تاقیکردنەوەی API:', error.message);
    if (error.response) {
      console.error('   🔧 وەڵامی هەڵە:', error.response.data);
    }
  }
}

// Run tests
testAPI();