'use strict';

/**
 * Module dependencies
 */
var emotionsPolicy = require('../policies/emotions.server.policy'),
  emotions = require('../controllers/emotions.server.controller');

module.exports = function(app) {
  // Emotions Routes
  app.route('/api/emotions').all(emotionsPolicy.isAllowed)
    .get(emotions.list)
    .post(emotions.create);

  app.route('/api/emotions/:emotionId').all(emotionsPolicy.isAllowed)
    .get(emotions.read)
    .put(emotions.update)
    .delete(emotions.delete);

  // Finish by binding the Emotion middleware
  app.param('emotionId', emotions.emotionByID);
};
