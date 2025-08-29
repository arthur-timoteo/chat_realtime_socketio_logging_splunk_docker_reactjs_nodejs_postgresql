const express = require('express');
const router = express.Router();
const sendToSplunk = require('../service/splunk_hec');

router.post('/log', async (req, res) => {
  const { event } = req.body;

  try {

    await sendToSplunk(event.message, event.type_log, event.path_log, event.data, 'frontend', req);

    res.status(201).json({ message: 'Log successfully registered'});
  } catch (error) {
    await sendToSplunk('Internal server error', 'ERROR', 'LC-L-0', {error, data: req.body}, 'api', req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;