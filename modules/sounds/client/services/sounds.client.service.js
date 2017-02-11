// Sounds service used to communicate Sounds REST endpoints
(function() {
  'use strict';

  angular
    .module('sounds')
    .factory('SoundsService', SoundsService)
    .factory('UserSoundStatusService', UserSoundStatusService);

  SoundsService.$inject = ['$resource'];

  function SoundsService($resource) {
    return $resource('api/sounds/:soundId', {
      soundId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  UserSoundStatusService.$inject = ['$resource'];

  function UserSoundStatusService($resource) {
    return $resource('api/sounds-userSoundStatus', {
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
