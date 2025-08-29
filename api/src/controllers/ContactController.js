const express = require('express');
const contactRepository = require('../repositories/ContactRepository');
const router = express.Router();
const sendToSplunk = require('../service/splunk_hec');

router.post('/contact/add', async (req, res) => {
  const { fk_member, fk_member_contact } = req.body;

  try {

    //Validate that all parameters have been provided
    if(fk_member == null || fk_member_contact == null)
    {
      await sendToSplunk('The supplied object is incorrect', 'WARN', 'CC-CA_0', {data: req.body}, 'api', req);
      res.status(400).json({ message: 'The supplied object is incorrect'});
      return;
    }

    const contactAlreadyExists = await contactRepository.findOne(fk_member, fk_member_contact);

    if(contactAlreadyExists != null) {
      res.status(400).json({ message: 'This contact already exists' });
      return;
    }
    
    await contactRepository.add(fk_member, fk_member_contact);

    res.status(201).json({ message: 'Contact added with success'});
  } catch (error) {
    await sendToSplunk('Internal server error', 'ERROR', 'CC-CA_1', {error, data: { fk_member, fk_member_contact }}, 'api', req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/contact/list/:pk_member', async (req, res) => {
    const pkMember = req.params.pk_member;

  try {

    //Validate that all parameters have been provided
    if(pkMember == null)
    {
      res.status(400).json({ message: 'The request is incorrect'});
      return;
    }
    
    const result = await contactRepository.list(pkMember);

    res.status(200).json(result);
  } catch (error) {
    await sendToSplunk('Internal server error', 'ERROR', 'CC-CL_0', {error, data: req.params.pk_member}, 'api', req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/contact/list/conversation/:pk_member', async (req, res) => {
  const pkMember = req.params.pk_member;

try {

  //Validate that all parameters have been provided
  if(pkMember == null)
  {
    res.status(400).json({ message: 'The request is incorrect'});
    return;
  }
  
  const result = await contactRepository.listWithoutConversation(pkMember);

  res.status(200).json(result);
} catch (error) {
  await sendToSplunk('Internal server error', 'ERROR', 'CC-CLC_0', {error, data: req.params.pk_member}, 'api', req);
  res.status(500).json({ message: 'Internal server error' });
}
});

router.delete('/contact/:pkMemberContact', async (req, res) => {
  const pkMember = req.headers.authorization
  const pkMemberContact = req.params.pkMemberContact;

  try {

    await contactRepository.delete(pkMember, pkMemberContact);

    res.status(200).json({ message: 'Contact deleted with success'});
  } catch (error) {
    await sendToSplunk('Internal server error', 'ERROR', 'CC-C$_0', {error, data: {authorization: req.headers.authorization, pkMemberContact: req.params.pkMemberContact}}, 'api', req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;