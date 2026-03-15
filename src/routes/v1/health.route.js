
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    data: {},
    meta: {}
  });
});

module.exports = router;
