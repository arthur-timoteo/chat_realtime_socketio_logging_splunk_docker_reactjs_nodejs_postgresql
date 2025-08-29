const express = require('express');
const accountController = require('./controllers/AccountController');
const contactController = require('./controllers/ContactController');
const conversationController = require('./controllers/ConversationController');
const messageController = require('./controllers/MessageController');
const loggerController = require('./controllers/LoggerController');

const router = express.Router();

router.use(accountController);
router.use(contactController);
router.use(conversationController);
router.use(messageController);
router.use(loggerController);

module.exports = router;