(function() {
  'use strict';

  // Sounds controller
  angular
    .module('sounds')
    .controller('SoundsController', SoundsController);

  SoundsController.$inject = ['$scope', '$state', '$window', '$interval', '$log', 'Authentication', 'soundResolve', 'UserSoundStatusService'];

  function SoundsController($scope, $state, $window, $interval, $log, Authentication, sound, UserSoundStatusService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sound = sound;

    $interval(soundCtl, 3000);

    checkUserStatus();

    function soundCtl() {
      checkUserStatus();
    }

    function checkUserStatus() {
      UserSoundStatusService.get().$promise.then(function(userSoundStatus) {
        vm.youtubeId = userSoundStatus.youtubeId;
        vm.startTime = userSoundStatus.startTime;
        vm.youtubeUrl = 'http://www.youtube.com/embed/' + vm.youtubeId + '?autoplay=1';// + '&start=' + scope.startTime;
        if (!vm.youtubeId || vm.youtubeId === 'none') {
          vm.soundStatus = 'stop';
        }
        $log.debug(vm.youtubeId);
        $log.debug(vm.startTime);
        $log.debug(vm.youtubeUrl);
      });
    }
  }
}());
