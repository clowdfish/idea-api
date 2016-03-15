'use strict';

var express           = require('express'),
    runner            = require('swagger-node-runner'),
    passport          = require('passport'),
    session           = require('express-session'),
    morgan            = require('morgan'),
    cookieParser      = require('cookie-parser'),
    bodyParser        = require('body-parser'),
    multiparty        = require('multiparty'),
    languageKeyParser = require('./api/helpers/translateService').languageKeyParser;

// initiate server instance  ==================================================
var app = express();

// load configuration =========================================================
var authConfig = require('./api/config/auth');
var appConfig = require('./api/config/app');

var port = process.env.PORT || 10010;

// configuration of passport module ===========================================
require('./api/helpers/passportHandler')(passport);

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
  app.use(languageKeyParser);

  app.set('jwtTokenSecret', authConfig.secret);
  app.set('loginCallbackUrl', authConfig.loginCallbackUrl);

  // setup authentication
  app.use(passport.initialize());
  app.use(passport.session()); // required for Twitter auth

  /* Add multipart middleware */
  app.use(function (req, res, next) {

    if (req.url === '/api/account/upload' && req.method === 'POST') {

      var form = new multiparty.Form({
        autoFiles: true,
        uploadDir: appConfig['temporaryFolderDir']
      });

      form.parse(req, function(err, fields, files) {

        if(err)
          return res.status(500).json({
            message: err.message
          });

        if(!files || !files.hasOwnProperty('file'))
          return res.status(500).json({
            message: 'No files provided.'
          });

        req.files = files;
        next();
      });
    }
    else
      next();
  });
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