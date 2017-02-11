'use strict';

/**
 * Module dependencies
 */
var soundsPolicy = require('../policies/sounds.server.policy'),
  sounds = require('../controllers/sounds.server.controller'),
  userSoundStatus = require('../controllers/user-sound-status.server.controller');

module.exports = function(app) {
  // Sounds Routes
  app.route('/api/sounds').all(soundsPolicy.isAllowed)
    .get(sounds.list);

  app.route('/api/sounds/:soundId').all(soundsPolicy.isAllowed)
    .get(sounds.read);

  app.route('/api/sounds/launch/:controlUserId/:youtubeId').all(soundsPolicy.isAllowed)
    .get(sounds.launch);

  app.route('/api/sounds-userSoundStatus').all(soundsPolicy.isAllowed)
    .get(userSoundStatus.readUserSoundStatus);

  // Finish by binding the Sound middleware
  app.param('soundId', sounds.soundByID);

  // Finish by binding the user middleware
  app.param('controlUserId', userSoundStatus.userByID);
};
