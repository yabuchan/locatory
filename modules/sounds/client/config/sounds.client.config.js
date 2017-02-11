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
      state: 'sounds.play',
      roles: ['user']
    });
  }
}());
