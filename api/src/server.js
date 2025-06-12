const app = require('./app');
const setupSocketIO = require('./service/socket.io');

const PORT = process.env.PORT || 3001;

const expressServer = app.listen(PORT, () => console.log(`API is running in the port ${PORT}!`));

// Start the Socket.IO server
setupSocketIO(expressServer);