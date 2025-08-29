const express = require('express');
const conversationRepository = require('../repositories/ConversationRepository');
const router = express.Router();
const sendToSplunk = require('../service/splunk_hec');

router.post('/conversation/create', async (req, res) => {
  const { type_conversation, title, list_pk_member } = req.body;

  try {

    //Validate that all parameters have been provided
    if(type_conversation == 0 && list_pk_member == null)
    {
      await sendToSplunk('The supplied object is incorrect', 'WARN', 'CC-CC_0', {data: req.body}, 'api', req);
      res.status(400).json({ message: 'The supplied object is incorrect'});
      return;
    } 
    else if(type_conversation == 1 && title == null || type_conversation == 1 && list_pk_member == null)
    {
      await sendToSplunk('The supplied object is incorrect', 'WARN', 'CC-CC_1', {data: req.body}, 'api', req);
      res.status(400).json({ message: 'The supplied object is incorrect'});
      return;
    }

    if(type_conversation == 0){
      //Validate that conversation already exists
      var conversationAlreadyExists = await conversationRepository.findOne(type_conversation, list_pk_member, null);
      
      if(conversationAlreadyExists != null && conversationAlreadyExists.length > 0){
        await sendToSplunk('The conversation already exists', 'WARN', 'CC-CC_2', {data: req.body}, 'api', req);
        res.status(400).json({ 
          message: 'This conversation already exists',
          data: {
            pk_conversation: conversationAlreadyExists[0].pk
          }
        });
        return;
      }
    }
    
    await conversationRepository.create(type_conversation, title, list_pk_member);

    const conversationCreated = await conversationRepository.findOne(type_conversation, list_pk_member, title);

    res.status(201).json({ 
      message: 'Conversation created with success',
      data: {
        pk_conversation: conversationCreated[0].pk
      }
    });
  } catch (error) {
    await sendToSplunk('Internal server error', 'ERROR', 'CC-CC_3', {error, data: req.body}, 'api', req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/conversation/list/:pk_member', async (req, res) => {
  const pkMember = req.params.pk_member;

  try {

    //Validate that all parameters have been provided
    if(pkMember == null)
    {
      await sendToSplunk('The supplied object is incorrect', 'WARN', 'CC-CL_0', null, 'api', req);
      res.status(400).json({ message: 'The request is incorrect'});
      return;
    }
    
    const result = await conversationRepository.list(pkMember);

    res.status(200).json(result);
  } catch (error) {
    await sendToSplunk('Internal server error', 'ERROR', 'CC-CL_1', {error}, 'api', req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;