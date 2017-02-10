(function () {
  'use strict';

  angular
    .module('sounds')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sounds',
      state: 'sounds',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sounds', {
      title: 'List Sounds',
      state: 'sounds.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sounds', {
      title: 'Create Sound',
      state: 'sounds.create',
      roles: ['user']
    });
  }
}());
