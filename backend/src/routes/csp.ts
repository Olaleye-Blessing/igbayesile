import express from 'express';

const router = express.Router();

router.post('/api', (req, res) => {
  const body = req.body();
  console.log('___ CSP WEB VIOLATION ____');
  console.log(body);
  res.status(200).json({
    status: 'success',
  });
});

router.post('/web', (req, res) => {
  const body = req.body();
  console.log('___ CSP WEB VIOLATION ____');
  console.log(body);
  res.status(200).json({
    status: 'success',
  });
});

export default router;
