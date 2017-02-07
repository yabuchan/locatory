'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Emotion Schema
 */
var EmotionSchema = new Schema({
  lng: {
    type: String,
    required: 'Please fill Emotion lng',
  },
  lat: {
    type: String,
    required: 'Please fill Emotion lat',
  },
  //Example: 
  //context: {
  //  type: String,
  //  required: 'Please fill Emotion context',
  //},
  //Example: WAKE, RUN, BYCICLE, ...
  activity: {
    type: String,
    required: 'Please fill Emotion activity',
  },
  season: {
    type: String,
    required: 'Please fill Emotion season',
  },
  weather: {
    type: String,
    required: 'Please fill Emotion weather',
  },
  //Example: golf, ramen
  preferences: [{
    type: String
  }],
  soundUrl: {
    type: String,
    required: 'Please fill Emotion soundUrl',
  },
  soundKeyWords: [{
    type: String
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Emotion', EmotionSchema);
