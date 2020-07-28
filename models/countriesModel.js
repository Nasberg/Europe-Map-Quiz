const mongoose = require('mongoose');

// schema
const countriesSchema = mongoose.Schema({
  name: String,
  short: String
});

const CountriesModel = module.exports = mongoose.model('countries', countriesSchema);
