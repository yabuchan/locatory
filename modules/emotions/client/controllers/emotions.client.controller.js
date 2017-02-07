(function () {
  'use strict';

  // Emotions controller
  angular
    .module('emotions')
    .controller('EmotionsController', EmotionsController);

  EmotionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'emotionResolve'];

  function EmotionsController ($scope, $state, $window, Authentication, emotion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.emotion = emotion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Emotion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.emotion.$remove($state.go('emotions.list'));
      }
    }

    // Save Emotion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.emotionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.emotion._id) {
        vm.emotion.$update(successCallback, errorCallback);
      } else {
        vm.emotion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('emotions.view', {
          emotionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
