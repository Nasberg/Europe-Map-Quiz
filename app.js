const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// import controllers
const gameController = require('./controllers/gameController');

// connect to mongodb
mongoose.connect('mongodb+srv://maxedevents:maxedevents@eriksfirstcluster-0kjfp.gcp.mongodb.net/maps_db?retryWrites=true&w=majority');
let db = mongoose.connection;

// check mongodb connection
db.once('open', () => {
  console.log('Connected to Mongodb');
});

// check for mongodb errors
db.on('error', (err) => {
  console.log(err);
});

// init express
let app = express();

// init template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// init static files
app.use(express.static('./public'));

// fire controllers
gameController(app);

// listen to port
app.listen(3035, () => {
  console.log('Listening to port 3035');
});
