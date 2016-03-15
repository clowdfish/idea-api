'use strict';

var express           = require('express'),
    runner            = require('swagger-node-runner'),
    session           = require('express-session'),
    morgan            = require('morgan'),
    cookieParser      = require('cookie-parser'),
    bodyParser        = require('body-parser')

// initiate server instance  ==================================================
var app = express();

// load configuration =========================================================
var port = process.env.PORT || 10010;

// swagger configuration ======================================================
var config = {
  appRoot: __dirname
};

/**
 * General server setup is happening here. We are setting up the middleware
 * that is used for each incoming request.
 */
function setupServer() {

  app.use(morgan('dev')); // log every request to the console
  app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
    extended: false
  }));
  app.use(bodyParser.json()); // parse application/json
  app.use(cookieParser());
  app.use(session({
    secret: 'errare humanum est',
    cookie: {
      httpOnly: true,
      secure: false, // https required for setting it to true
      maxAge: null // session cookie: is deleted after closing the browser
    },
    resave: false,
    saveUninitialized: false // passport will take care
  }));

  app.set('jwtTokenSecret', 'answer42!');
}

// start server ===============================================================
runner.create(config, function(err, swaggerRunner) {
  if (err) { throw err; }

  setupServer();

  // install middleware
  var expressRunner = swaggerRunner.expressMiddleware();
  expressRunner.register(app);

  app.listen(port);
  console.log('\tServer started on port ' + port + '.');
});