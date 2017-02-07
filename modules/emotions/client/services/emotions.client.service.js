// Emotions service used to communicate Emotions REST endpoints
(function () {
  'use strict';

  angular
    .module('emotions')
    .factory('EmotionsService', EmotionsService);

  EmotionsService.$inject = ['$resource'];

  function EmotionsService($resource) {
    return $resource('api/emotions/:emotionId', {
      emotionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
