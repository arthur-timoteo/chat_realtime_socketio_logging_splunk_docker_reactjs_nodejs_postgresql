const express = require('express');
const messageRepository = require('../repositories/MessageRepository');
const router = express.Router();
const sendToSplunk = require('../service/splunk_hec');

router.post('/message/create', async (req, res) => {
  const { fk_conversation, fk_member, content_text } = req.body;

  try {

    //Validate that all parameters have been provided
    if(fk_conversation == null || fk_member == null || content_text == null)
    {
      await sendToSplunk('The supplied object is incorrect', 'WARN', 'MC-MC_0', {data: req.body}, 'api', req);
      res.status(400).json({ message: 'The supplied object is incorrect'});
      return;
    }
    
    await messageRepository.create(fk_conversation, fk_member, content_text);

    res.status(201).json({ message: 'Message saved with success'});
  } catch (error) {
    await sendToSplunk('Internal server error', 'ERROR', 'MC-MC_1', {error, data: req.body}, 'api', req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/message/list/:pk_conversation', async (req, res) => {
  const pkConversation = req.params.pk_conversation;

  try {

    //Validate that parameter have been provided
    if(pkConversation == null)
    {
      await sendToSplunk('The supplied object is incorrect', 'WARN', 'MC-ML_0', null, 'api', req);
      res.status(400).json({ message: 'The request is incorrect'});
      return;
    }
    
    const result = await messageRepository.list(pkConversation);

    res.status(200).json(result);
  } catch (error) {
    await sendToSplunk('Internal server error', 'ERROR', 'MC-ML_1', {error, data: req.body}, 'api', req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;