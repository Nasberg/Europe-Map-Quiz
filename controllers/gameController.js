const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

// import models
const CountriesModel = require('../models/countriesModel');
const HighscoreModel = require('../models/highscoreModel');

// init encoder parser
const urlEncoderParser = bodyParser.urlencoded({extended: false});

module.exports = (app) => {
  // render index page
  app.get('/', (req, res) => {
    res.render('index');
  });

  

  // get all countries
  app.get('/get-countries', (req, res) => {
    CountriesModel.find({}, (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        res.json(data);
      }
    });
  });



  // get highscores
  app.get('/get-highscores', (req, res) => {
    HighscoreModel.find({}, (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        res.json(data);
      }
    });
  });



  // add new player to highscore
  app.post('/add-player', urlEncoderParser, (req, res) => {
    let newPlayer = HighscoreModel(req.body).save((err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        res.json(data);
      }
    });
  });



}
