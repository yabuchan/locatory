'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Sounds Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/sounds',
      permissions: '*'
    }, {
      resources: '/api/sounds/:soundId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/sounds',
      permissions: ['get', 'post']
    }, {
      resources: '/api/sounds/:soundId',
      permissions: ['get']
    }, {
      resources: '/api/sounds-userSoundStatus',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/sounds',
      permissions: ['get']
    }, {
      resources: '/api/sounds/:soundId',
      permissions: ['get']
    }, {
      resources: '/api/sounds/launch/:controlUserId/:youtubeId',
      permissions: ['get']
    }, {
      resources: '/api/sounds-userSoundStatus',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Sounds Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Sound is being processed and the current user created it then allow any manipulation
  if (req.sound && req.user && req.sound.user && req.sound.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
