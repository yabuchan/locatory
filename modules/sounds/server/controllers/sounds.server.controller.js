'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sound = mongoose.model('Sound'),
  User = mongoose.model('User'),
  UserStatus = mongoose.model('UserStatus'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Show the current Sound
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sound = req.sound ? req.sound.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sound.isCurrentUserOwner = req.user && sound.user && sound.user._id.toString() === req.user._id.toString();

  res.jsonp(sound);
};



/**
 * List of Sounds
 */
exports.list = function(req, res) {
  var sounds = [];
  sounds.push({
    id: 'abc11111',
    description: 'Figure skate in Salt Lake Olympic',
    detailDescription: 'In 1986, Salt Lake Olympic was held at this place. figure skate here was most memorable. After the dead heat, John Brown won the game.',
    year: '1986',
    location: 'Salt Lake'
  });
  sounds.push({
    id: 'abc11112',
    description: 'Figure skate in Salt Lake Olympic',
    detailDescription: 'In 1986, Salt Lake Olympic was held at this place. figure skate here was most memorable. After the dead heat, John Brown won the game.',
    year: '1986',
    location: 'Salt Lake'
  });
  res.jsonp(sounds);

  /*
  Sound.find().sort('-created').populate('user', 'displayName').exec(function(err, sounds) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sounds);
    }
  });
  */
};

/**
 * Sound middleware
 */
exports.soundByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sound is invalid'
    });
  }

  Sound.findById(id).populate('user', 'displayName').exec(function(err, sound) {
    if (err) {
      return next(err);
    } else if (!sound) {
      return res.status(404).send({
        message: 'No Sound with that identifier has been found'
      });
    }
    req.sound = sound;
    next();
  });
};

exports.launch = function(req, res) {
  console.log(req.params.controlUserId);
  //get parameters
  var controlUserId = req.params.controlUserId,
    youtubeId = req.params.youtubeId;

  //Update the user status
  var statusCode = updateUserSoundStatus(controlUserId, youtubeId);

  var sounds = 'ok';
  res.status(statusCode).send({
    message: '-'
  });
};


/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load User ' + id));
    }

    req.profile = user;
    next();
  });
};

function updateUserSoundStatus(controlUserId, youtubeId) {
  return 200;
  /*
  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load User ' + id));
    }

    req.profile = user;
    next();
  });


  sound.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sound);
    }
  });
  */
}
