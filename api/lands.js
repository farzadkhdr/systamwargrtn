// api/lands.js
let lands = [
  {
    id: '1',
    owner: 'نموونەی خاوەن',
    mobile: '07707654321',
    location: 'سێبەردان',
    size: '500 م²',
    price: '300,000 دینار',
    status: 'بەردەستە',
    createdAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  // هەموو زەویەکان
  if (method === 'GET') {
    return res.status(200).json({
      success: true,
      data: lands,
      count: lands.length
    });
  }

  // زیادکردنی زەویی نوێ
  if (method === 'POST') {
    const newLand = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    lands.push(newLand);
    return res.status(201).json({
      success: true,
      message: 'زەوی بە سەرکەوتویی زیادکرا',
      data: newLand
    });
  }

  // نوێکردنەوەی زەوی
  if (method === 'PUT' && id) {
    const { status } = req.body;
    const landIndex = lands.findIndex(land => land.id === id);
    
    if (landIndex !== -1) {
      lands[landIndex].status = status;
      return res.status(200).json({
        success: true,
        message: 'دۆخی زەوی نوێکرایەوە',
        data: lands[landIndex]
      });
    }
    
    return res.status(404).json({ success: false, error: 'زەوی نەدۆزرایەوە' });
  }

  // سڕینەوەی زەوی
  if (method === 'DELETE' && id) {
    lands = lands.filter(land => land.id !== id);
    return res.status(200).json({
      success: true,
      message: 'زەوی سڕایەوە'
    });
  }

  res.status(405).json({ success: false, error: 'مێساجێکی نادروست' });
}