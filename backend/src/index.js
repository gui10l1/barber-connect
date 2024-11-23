const server = require('./server');
const appPort = process.env.APP_PORT || 8000;

server.listen(appPort, () => {
  console.log('🚀 App is running on port: ' + appPort);
});
