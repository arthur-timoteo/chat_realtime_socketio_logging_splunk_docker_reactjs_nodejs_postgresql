const express = require('express');
const contactRepository = require('../repositories/ContactRepository');
const router = express.Router();

router.post('/contact/add', async (req, res) => {
  const { fk_member, fk_member_contact } = req.body;

  try {

    //Validate that all parameters have been provided
    if(fk_member == null || fk_member_contact == null)
    {
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
  } catch (err) {
    // Print error in console
    console.error(err);
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
  } catch (err) {
    // Print error in console
    console.error(err);
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
} catch (err) {
  // Print error in console
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}
});

router.delete('/contact/:pkMemberContact', async (req, res) => {
  const pkMember = req.headers.authorization
  const pkMemberContact = req.params.pkMemberContact;

  try {

    const result = await contactRepository.delete(pkMember, pkMemberContact);

    res.status(200).json({ message: 'Contact deleted with success'});
  } catch (err) {
    // Print error in console
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;