/**
 * Web Atelier 2022  Exercise 7 - Single-Page Web Applications with Fetch and Client-side Views
 *
 * Student: Giulio Rebuffo
 *
 * Main Server Application
 *
 * version 1289 Wed Nov 02 2022 17:01:56 GMT+0100 (Central European Standard Time)
 *
 */

//require framework and middleware dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override');
const multer  = require('multer');

const {WebSocketHandler} = require('./ws/websocket_handler');

const { Server } = require("socket.io");

var websocket_handler = new WebSocketHandler();

//init framework
const app = express();



app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(express.json({limit: '4MB'}));    // parse application/json
app.use(multer().none());   //parse multipart/form-data

app.use(express.static(path.join(__dirname, 'public'), {index: "index.html"}));
app.use('/three', express.static(__dirname + '/node_modules/three/'));
app.use('/evaluatex', express.static(__dirname + '/node_modules/evaluatex/'));

app.use(methodOverride('_method'));
app.use(express.static('public'))

app.set('view engine', 'ejs');

app.get("/pin/:id", (request, response) => {
  let id = request.params.id
  let states = websocket_handler.getStates()
  if (!states.hasOwnProperty(id)) {
    response.writeHead(302, {'Location': '/'})
    response.end()
    return
  }
  response.render("main", {id, isTeacher: states[id].sockets.length === 0 })
})

app.post("/access", (request, response) => {
  let signature = request.body.signature;
  if (signature){
    states.forEach(id => {
      if (states[id].signature === signature) {
        response.json({id, isTeacher: true});
        return
      }
    });
  }
  response.sendStatus(203);       // Non-Authoritative Information
});

//default fallback handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  //if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
  //}

  // production error handler
  // no stacktraces leaked to user
  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   res.json({
  //     message: err.message,
  //     error: {}
  //   });
  // });


//start server
app.set('port', process.env.PORT || 8888);

var server = require('http').createServer(app);

const io = new Server(server);
websocket_handler.setIO(io);

io.on('connection', (socket) => websocket_handler.on_connect(socket));

server.on('listening', function() {
  console.log('Express server listening on port ' + server.address().port);
});

server.listen(app.get('port'));