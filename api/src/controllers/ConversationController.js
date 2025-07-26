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

    if(type_conversation == 0){
      //Validate that conversation already exists
      var conversationAlreadyExists = await conversationRepository.findOneByParticipants(type_conversation, list_pk_member);
      
      if(conversationAlreadyExists != null && conversationAlreadyExists.length > 0){
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

    const conversationCreated = await conversationRepository.findOneByParticipants(type_conversation, list_pk_member);

    res.status(201).json({ 
      message: 'Conversation created with success',
      data: {
        pk_conversation: conversationCreated[0].pk
      }
    });
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