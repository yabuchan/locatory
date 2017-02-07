'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Emotion = mongoose.model('Emotion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Emotion
 */
exports.create = function(req, res) {
  var emotion = new Emotion(req.body);
  emotion.user = req.user;

  emotion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emotion);
    }
  });
};


/**
 * List of Emotions
 */
exports.list = function(req, res) {
  //@params:
  var lng = req.params.lng;
  var lat = req.params.lat;

  var activity = req.params.activity;
  var season = req.params.season;
  var weather = req.params.weather;
  var preferences = req.params.preferences;
  var soundKeyWords = req.params.soundKeyWords;

  var locationLimitationInRadius = 0.003 // 0.003 in lat/lng is about 1 km.

  Emotion.find(
    //limit the entries by location.
    //    $and: [{ "lat": { $gt: lat - locationLimitationInRadius, $lt: lat + locationLimitationInRadius } },
    //      { "lng": { $gt: lng - locationLimitationInRadius, $lt: lng + locationLimitationInRadius } }]
  ).sort('-created').populate('user', 'displayName').exec(function(err, emotions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //Here is business logic what emotions to respond
      emotions = calcDistanceToEmotionsFrom(lng, lat, emotions);
      var nearEmotions = getEmotionsWhoseGeoDistanceIsWithIn(radius, emotionsWithDistance);
      //respond
      res.jsonp(optimalEmotions);
    }
  });
};


/**
 * Show the current Emotion
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var emotion = req.emotion ? req.emotion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  emotion.isCurrentUserOwner = req.user && emotion.user && emotion.user._id.toString() === req.user._id.toString();

  res.jsonp(emotion);
};

/**
 * Update a Emotion
 */
exports.update = function(req, res) {
  var emotion = req.emotion;

  emotion = _.extend(emotion, req.body);

  emotion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emotion);
    }
  });
};

/**
 * Delete an Emotion
 */
exports.delete = function(req, res) {
  var emotion = req.emotion;

  emotion.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emotion);
    }
  });
};


/**
 * Emotion middleware
 */
exports.emotionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Emotion is invalid'
    });
  }

  Emotion.findById(id).populate('user', 'displayName').exec(function(err, emotion) {
    if (err) {
      return next(err);
    } else if (!emotion) {
      return res.status(404).send({
        message: 'No Emotion with that identifier has been found'
      });
    }
    req.emotion = emotion;
    next();
  });
};


function calcDistanceToEmotionsFrom(lng, lat, emotions) {
  emotions.forEach(function(emotion) {
    emotion.distance = Math.pow((emotions.lng - lng) * (emotions.lng - lng) + (emotions.lat - lat) * (emotions.lat - lat), 0.5);
  });
  return emotions;
}

function getEmotionsWhoseGeoDistanceIsWithIn(radius, emotionsWithDistance) {
  var nearEmotions = [];
  emotionsWithDistance.forEach(function(emotion) {
    if (emotion.disance < radius)
      nearEmotions.push(emotion);
  });
  return nearEmotions;
}
