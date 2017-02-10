(function () {
  'use strict';

  angular
    .module('sounds')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sounds', {
        abstract: true,
        url: '/sounds',
        template: '<ui-view/>'
      })
      .state('sounds.list', {
        url: '',
        templateUrl: 'modules/sounds/client/views/list-sounds.client.view.html',
        controller: 'SoundsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sounds List'
        }
      })
      .state('sounds.create', {
        url: '/create',
        templateUrl: 'modules/sounds/client/views/form-sound.client.view.html',
        controller: 'SoundsController',
        controllerAs: 'vm',
        resolve: {
          soundResolve: newSound
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sounds Create'
        }
      })
      .state('sounds.edit', {
        url: '/:soundId/edit',
        templateUrl: 'modules/sounds/client/views/form-sound.client.view.html',
        controller: 'SoundsController',
        controllerAs: 'vm',
        resolve: {
          soundResolve: getSound
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sound {{ soundResolve.name }}'
        }
      })
      .state('sounds.view', {
        url: '/:soundId',
        templateUrl: 'modules/sounds/client/views/view-sound.client.view.html',
        controller: 'SoundsController',
        controllerAs: 'vm',
        resolve: {
          soundResolve: getSound
        },
        data: {
          pageTitle: 'Sound {{ soundResolve.name }}'
        }
      });
  }

  getSound.$inject = ['$stateParams', 'SoundsService'];

  function getSound($stateParams, SoundsService) {
    return SoundsService.get({
      soundId: $stateParams.soundId
    }).$promise;
  }

  newSound.$inject = ['SoundsService'];

  function newSound(SoundsService) {
    return new SoundsService();
  }
}());
