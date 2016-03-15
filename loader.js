'use strict';

var express = require('express'),
       path = require('path'),
        net = require('net');

var port = 8088;
process.argv.forEach(function (val, index, array) {
  if((val == '-p' || val == '--port') && process.argv.length > index + 1) {

    var portNumber = process.argv[index + 1];

    if(Number(portNumber) != portNumber || portNumber % 1 != 0)
      return console.error('Port number must be an integer value!');

    port = portNumber;
  }
});

// check if file loader is already active
var tester = net.createServer()
  .once('error', function(err) {
    if (err.code != 'EADDRINUSE') {
      console.warn('Could not start file loader...');
    }

    tester.close();
  })
  .once('listening', function() {
    tester
      .once('close', function() { startFileLoader(); })
      .close()
  })
  .listen(port);

/**
 * Start the file loader.
 */
function startFileLoader() {
  var fileLoader = express();

  fileLoader.get('/definitions.yaml', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.attachment('./api/swagger/definitions.yaml');
    res.sendFile(path.join(__dirname, 'api/swagger/definitions.yaml'));
  });

  fileLoader.listen(port);
}

