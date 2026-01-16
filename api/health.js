// api/health.js
export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: 'APIی سیستەمی ناردنی داواکاری چالاکە',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}