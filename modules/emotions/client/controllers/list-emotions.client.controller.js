(function () {
  'use strict';

  angular
    .module('emotions')
    .controller('EmotionsListController', EmotionsListController);

  EmotionsListController.$inject = ['EmotionsService'];

  function EmotionsListController(EmotionsService) {
    var vm = this;

    vm.emotions = EmotionsService.query();
  }
}());
