// api/requests.js
const requests = []; // لە کاتی ڕاستەقینەدا، لێرە دەیتابەیس بەکاربهێنە

export default function handler(req, res) {
  const { method } = req;

  // Health Check
  if (req.url === '/api/health') {
    return res.status(200).json({ success: true, message: 'API چالاکە' });
  }

  // گەڕاندنی هەموو داواکاریەکان
  if (method === 'GET') {
    return res.status(200).json({
      success: true,
      data: requests,
      count: requests.length,
    });
  }

  // ناردنی داواکاری نوێ
  if (method === 'POST') {
    const newRequest = {
      id: Date.now().toString(),
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    requests.push(newRequest);
    
    return res.status(201).json({
      success: true,
      message: 'داواکاری بە سەرکەوتویی نێردرا',
      data: newRequest,
    });
  }

  // نوێکردنەوەی دۆخی داواکاری
  if (method === 'PUT' && req.query.id) {
    const { id } = req.query;
    const { status } = req.body;
    
    const requestIndex = requests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      requests[requestIndex].status = status;
      return res.status(200).json({
        success: true,
        message: 'دۆخ نوێکرایەوە',
        data: requests[requestIndex],
      });
    }
    
    return res.status(404).json({ success: false, error: 'داواکاری نەدۆزرایەوە' });
  }

  res.status(405).json({ success: false, error: 'مێساجێکی نادروست' });
}
