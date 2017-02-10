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
  var lng = req.params.lng;
  var lat = req.params.lat;
  var activity = req.params.activity;

  var sounds = [];

  //create search words.


  //get list of youtube.


  //Add list to response.
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

  //respond list.
  res.jsonp(sounds);

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
  if (controlUserId) {
    UserStatus.findOne({ userId: controlUserId }, function(err, userstatus) {
      if (userstatus) {
        if (youtubeId) {
          userstatus.youtubeId = youtubeId;
        } else {
          userstatus.youtubeId = 'none';
        }
        userstatus.save(function(err) {
          if (err) {
            console.error('ERROR!');
          }
        });
      } else {
        console.log('no userStatus with this user_id is found');
        userstatus = new UserStatus({ userId: controlUserId, youtubeId: youtubeId });
        console.log(userstatus);
        userstatus.save(function(err) {
          if (err) {
            console.error('ERROR!');
          }
        });
      }
    });
    return 200;
  } else {
    return 404;
  }
}
