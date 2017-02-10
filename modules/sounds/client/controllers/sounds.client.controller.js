(function () {
  'use strict';

  // Sounds controller
  angular
    .module('sounds')
    .controller('SoundsController', SoundsController);

  SoundsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'soundResolve'];

  function SoundsController ($scope, $state, $window, Authentication, sound) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sound = sound;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sound
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sound.$remove($state.go('sounds.list'));
      }
    }

    // Save Sound
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.soundForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sound._id) {
        vm.sound.$update(successCallback, errorCallback);
      } else {
        vm.sound.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sounds.view', {
          soundId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
