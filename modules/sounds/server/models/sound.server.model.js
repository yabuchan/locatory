'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sound Schema
 */
var SoundSchema = new Schema({});

mongoose.model('Sound', SoundSchema);


/**
 * User Status Schema
 */
var UserStatusSchema = new Schema({
  userId: String,
  youtubeId: String,
  startTime: Number
});
mongoose.model('UserStatus', UserStatusSchema);
