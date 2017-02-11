'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserStatus = mongoose.model('UserStatus'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Show the current User sound status
 */
exports.readUserSoundStatus = function(req, res) {
  console.log(req.user._id);
  UserStatus.findOne({
    userId: req.user._id
  }).exec(function(err, userStatus) {
    if (err) {
      res.status(400).send({
        message: 'No user status is found.'
      });
    } else {
      res.jsonp(userStatus);
    }
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
