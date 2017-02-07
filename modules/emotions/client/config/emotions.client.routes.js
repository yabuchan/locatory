(function () {
  'use strict';

  angular
    .module('emotions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('emotions', {
        abstract: true,
        url: '/emotions',
        template: '<ui-view/>'
      })
      .state('emotions.list', {
        url: '',
        templateUrl: 'modules/emotions/client/views/list-emotions.client.view.html',
        controller: 'EmotionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Emotions List'
        }
      })
      .state('emotions.create', {
        url: '/create',
        templateUrl: 'modules/emotions/client/views/form-emotion.client.view.html',
        controller: 'EmotionsController',
        controllerAs: 'vm',
        resolve: {
          emotionResolve: newEmotion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Emotions Create'
        }
      })
      .state('emotions.edit', {
        url: '/:emotionId/edit',
        templateUrl: 'modules/emotions/client/views/form-emotion.client.view.html',
        controller: 'EmotionsController',
        controllerAs: 'vm',
        resolve: {
          emotionResolve: getEmotion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Emotion {{ emotionResolve.name }}'
        }
      })
      .state('emotions.view', {
        url: '/:emotionId',
        templateUrl: 'modules/emotions/client/views/view-emotion.client.view.html',
        controller: 'EmotionsController',
        controllerAs: 'vm',
        resolve: {
          emotionResolve: getEmotion
        },
        data: {
          pageTitle: 'Emotion {{ emotionResolve.name }}'
        }
      });
  }

  getEmotion.$inject = ['$stateParams', 'EmotionsService'];

  function getEmotion($stateParams, EmotionsService) {
    return EmotionsService.get({
      emotionId: $stateParams.emotionId
    }).$promise;
  }

  newEmotion.$inject = ['EmotionsService'];

  function newEmotion(EmotionsService) {
    return new EmotionsService();
  }
}());
