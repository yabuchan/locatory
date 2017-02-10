(function () {
  'use strict';

  angular
    .module('emotions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Emotions',
      state: 'emotions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'emotions', {
      title: 'List Emotions',
      state: 'emotions.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'emotions', {
      title: 'Create Emotion',
      state: 'emotions.create',
      roles: ['user']
    });
  }
}());