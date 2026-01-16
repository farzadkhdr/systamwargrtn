// api/houses.js
let houses = [
  {
    id: '1',
    owner: 'نموونەی خاوەن',
    mobile: '07701234567',
    location: 'شۆرش',
    type: 'تاپۆ',
    size: '150 م²',
    price: '500,000 دینار',
    status: 'بەردەستە',
    createdAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  // هەموو خانووەکان
  if (method === 'GET') {
    return res.status(200).json({
      success: true,
      data: houses,
      count: houses.length
    });
  }

  // زیادکردنی خانووی نوێ
  if (method === 'POST') {
    const newHouse = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    houses.push(newHouse);
    return res.status(201).json({
      success: true,
      message: 'خانوو بە سەرکەوتویی زیادکرا',
      data: newHouse
    });
  }

  // نوێکردنەوەی خانوو
  if (method === 'PUT' && id) {
    const { status } = req.body;
    const houseIndex = houses.findIndex(house => house.id === id);
    
    if (houseIndex !== -1) {
      houses[houseIndex].status = status;
      return res.status(200).json({
        success: true,
        message: 'دۆخی خانوو نوێکرایەوە',
        data: houses[houseIndex]
      });
    }
    
    return res.status(404).json({ success: false, error: 'خانوو نەدۆزرایەوە' });
  }

  // سڕینەوەی خانوو
  if (method === 'DELETE' && id) {
    houses = houses.filter(house => house.id !== id);
    return res.status(200).json({
      success: true,
      message: 'خانوو سڕایەوە'
    });
  }

  res.status(405).json({ success: false, error: 'مێساجێکی نادروست' });
}