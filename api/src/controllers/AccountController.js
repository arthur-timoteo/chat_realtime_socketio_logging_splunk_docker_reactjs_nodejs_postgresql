const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();
const sendToSplunk = require('../service/splunk_hec');

router.post('/account/signup', async (req, res) => {
  try {

    //Validate that all parameters have been provided
    if(req.body.first_name == null || req.body.email == null || req.body.password_signin == null || req.body.ip_address == null)
    {
      sendToSplunk('The supplied object is incorrect', 'WARN', 'AC-ASU_0', {data: req.body}, req);
      res.status(400).json({ message: 'The supplied object is incorrect'});
      return;
    }
    
    const result = await accountRepository.create(req.body);

    if(!result)
    {
      res.status(500).json({ message: 'An error occurred while trying to create the member'});
      return;
    } 

    sendToSplunk('Created with success', 'INFO', 'AC-ASU_1', {email: req.body.email}, req);
    res.status(201).json({ message: 'Created with success'});
  } catch (err) {
    sendToSplunk('Error to try signup a member', 'ERROR', 'AC-ASU_3', {error: err}, req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/account/signin', async (req, res) => {
  try {

    //Validates that the required sign-in parameters have been provided
    if(req.body.email == null || req.body.password_signin == null)
    {
      sendToSplunk('The supplied object is incorrect', 'WARN', 'AC-ASI_0', {data: req.body}, req);
      res.status(400).json({ message: 'The supplied object is incorrect'});
      return;
    }
    
    //Validates that the ip address has been provided
    if(req.body.ip_address == null)
    {
      res.status(500).json({ message: 'Internal server error'});
      return;
    }

    const result = await accountRepository.signIn(req.body.email, req.body.password_signin, req.body.ip_address);

    if(result == null)
    {
      res.status(500).json({ message: 'Error trying to sign-in'});
      return;
    } 

    sendToSplunk('Member signed in with success', 'INFO', 'AC-ASI_1', {email: req.body.email}, req);
    res.status(200).json({ message: 'Signed In with success', data: result});
  } catch (err) {
    sendToSplunk('Error to try signin a member', 'ERROR', 'AC-ASI_2', {error: err}, req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/account', async (req, res) => {

  if(req.headers.authorization == null)
  {
    sendToSplunk('Bad request, authorization header is missing', 'WARN', 'AC-A_0', {data: req.body}, req);
    res.status(400).json({ message: 'Bad request, authorization header is missing'});
    return;
  }

  const pkMember = req.headers.authorization;

  try {

    const result = await accountRepository.findByPk(pkMember);

    res.status(200).json({ 
      message: 'Account data successfully retrieved',
      data: result
    });
  } catch (error) {
    sendToSplunk('Internal server error', 'ERROR', 'AC-A_1', {error}, req);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;