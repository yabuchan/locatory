(function () {
  'use strict';

  angular
    .module('sounds')
    .controller('SoundsListController', SoundsListController);

  SoundsListController.$inject = ['SoundsService'];

  function SoundsListController(SoundsService) {
    var vm = this;

    vm.sounds = SoundsService.query();
  }
}());
