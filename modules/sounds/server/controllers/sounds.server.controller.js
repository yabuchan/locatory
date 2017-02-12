'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sound = mongoose.model('Sound'),
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
  var address = req.query.address;
  var locality = req.query.locality;
  var lng = req.query.lng;
  var lat = req.query.lat;
  var activity = req.query.activity;

  var sounds = [];

  //create search words.


  //get list of youtube.


  //Add list to response.
  /*
  sounds.push({
    id: 'qr7kRYO29n4',
    description: 'New York in 1900s.',
    detailDescription: 'On the road, both carriages and automotives were running.',
    year: '1900s',
    location: 'New York'
  });
  sounds.push({
    id: 'wHW8IrEMQJ0',
    description: 'New York in 1930s',
    detailDescription: '',
    year: '1930s',
    location: 'Salt Lake'
  });
  sounds.push({
    id: 'AQJQRGAo3KY',
    description: 'New York in 1950s',
    detailDescription: 'There is a lot of cars.',
    year: '1950s',
    location: 'Salt Lake'
  });
*/
  sounds = getContents(locality, activity);
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

  var startTime = getStartTime(youtubeId);

  //Update the user status
  var statusCode = updateUserSoundStatus(controlUserId, youtubeId, startTime);
  var sounds = 'ok';
  res.status(statusCode).send({
    message: '-'
  });
};

function updateUserSoundStatus(controlUserId, youtubeId, startTime) {
  if (controlUserId) {
    UserStatus.findOne({ userId: controlUserId }, function(err, userstatus) {
      if (userstatus) {
        if (youtubeId) {
          userstatus.youtubeId = youtubeId;
        } else {
          userstatus.youtubeId = 'none';
        }
        userstatus.startTime = startTime;

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

function getStartTime(youtubeId) {
  var startTime;
  switch (youtubeId) {
    case 'aaa':
      startTime = 0;
      break;
    case 'aaa':
      startTime = 0;
      break;
    default:
      startTime = 0;
  }
  return startTime;
}

function getContents(locality, activity) {
  var sounds = [];
  if (activity === 'RIDING_BICYCLE') {
    sounds.push({
      id: 'jznOT028iK0',
      url: 'https://s3-us-west-1.amazonaws.com/hackathon-prototype/roadrace1.mp3',
      description: "Attaque d'Alberto Contador au col du Galibier Tour de France 2007",
      detailDescription: 'On the road, both carriages and automotives were running.',
      year: '1900s',
      location: 'New York'
    });
    sounds.push({
      id: 'mG8de1THZXU',
      url: 'https://s3-us-west-1.amazonaws.com/hackathon-prototype/roadrace2.mp3',
      description: "RHC - Red Hook Criterium London No.2 Official Race Video",
      detailDescription: 'On the road, both carriages and automotives were running.',
      year: '1900s',
      location: 'New York'
    });
  } else {
    sounds.push({
      url: 'https://s3-us-west-1.amazonaws.com/hackathon-prototype/soccer1.mp3',
      id: '9RHdrwLaUDA',
      description: 'AMAZING FAN GOAL CELEBRATIONS.',
      detailDescription: 'On the road, both carriages and automotives were running.',
      year: '1900s',
      location: 'New York'
    });
    sounds.push({
      id: 'o5_wfHfwyrg',
      url: 'https://s3-us-west-1.amazonaws.com/hackathon-prototype/soccer2.mp3',
      description: 'AMAZING FAN GOAL CELEBRATIONS',
      detailDescription: '',
      year: '1930s',
      location: 'Salt Lake'
    });
    sounds.push({
      id: 'JM-z_0GK_8E',
      url: 'https://s3-us-west-1.amazonaws.com/hackathon-prototype/soccer3.mp3',
      description: 'New York in 1950s',
      detailDescription: 'There is a lot of cars.',
      year: '1950s',
      location: 'Salt Lake'
    });
  }
  return sounds;
}
