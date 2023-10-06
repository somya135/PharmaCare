//========= importing modules ==========
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    routes = require('./server/routes/web'), //web routes
    apiRoutes = require('./server/routes/api'), //api routes
    connection = require("./server/config/db"); //mongodb connection

// creating express server
const { createProxyMiddleware } = require('http-proxy-middleware');

var app = express();

//========= configuration ==========

//===== get all the data from the body (POST)

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to set correct Content-Type for CSS files
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
      res.type('text/css');
    }
    next();
  });

// setting static files location './app' for angular app html and js
app.use(express.static(path.join(__dirname, 'app')));
// setting static files location './node_modules' for libs like angular, bootstrap
app.use(express.static('node_modules'));

// Proxy middleware for setting correct Content-Type header for Bootstrap CSS
const cssProxy = createProxyMiddleware('/node_modules/bootstrap/dist/css/bootstrap.css', {
    target: 'http://localhost', // Change this if your server is on a different host/port
    changeOrigin: true,
    onProxyRes(proxyRes, req, res) {
      if (proxyRes.headers['content-type'] === 'text/html') {
        proxyRes.headers['content-type'] = 'text/css';
      }
    },
  });
  app.use(cssProxy);
  
// configure our routes
app.use('/', routes);
app.use('/api', apiRoutes);

// setting port number for running server
var port = process.env.port || 3000;

// starting express server
app.listen(port, function() {
    console.log("Server is running at : http://localhost:" + port);
});
