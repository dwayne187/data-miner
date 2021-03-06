const app = require('./server');

const server_port = process.env.OPENSHIFT_NODEJS_PORT || process.argv[2] || 8080
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
 
if (!module.parent) {
  app.listen(server_port, server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
  });
}

module.exports = app;