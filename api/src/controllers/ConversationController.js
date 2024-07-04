const express = require('express');
const conversationRepository = require('../repositories/ConversationRepository');
const router = express.Router();

router.post('/conversation/create', async (req, res) => {
  const { type_conversation, title, list_pk_member } = req.body;

  try {

    //Validate that all parameters have been provided
    if(type_conversation == 0 && list_pk_member == null)
    {
      res.status(400).json({ message: 'The supplied object is incorrect'});
      return;
    } 
    else if(type_conversation == 1 && title == null || type_conversation == 1 && list_pk_member == null)
    {
      res.status(400).json({ message: 'The supplied object is incorrect'});
      return;
    }
    
    await conversationRepository.create(type_conversation, title, list_pk_member);

    res.status(201).json({ message: 'Conversation created with success'});
  } catch (err) {
    // Print error in console
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/conversation/list/:pk_member', async (req, res) => {
  const pkMember = req.params.pk_member;

  try {

    //Validate that all parameters have been provided
    if(pkMember == null)
    {
      res.status(400).json({ message: 'The request is incorrect'});
      return;
    }
    
    const result = await conversationRepository.list(pkMember);

    res.status(200).json(result);
  } catch (err) {
    // Print error in console
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;