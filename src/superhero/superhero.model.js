const mongoose = require('mongoose');
const { Schema } = mongoose;

const superheroSchema = new Schema({
  nickname: String,
  real_name: String,
  origin_description: String,
  superpowers: String,
  catch_phrase: String,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const superheroModel = mongoose.model('Superhero', superheroSchema);

module.exports = superheroModel;
