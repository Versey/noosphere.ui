const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'noosphere-ui-backend'
  });
});

module.exports = router;
