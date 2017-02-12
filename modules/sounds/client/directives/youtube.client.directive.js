(function() {
  'use strict';

  angular
    .module('sounds')
    .directive('youtube', youtube);

  youtube.$inject = ['$sce'];

  function youtube($sce) {
    return {
      restrict: 'EA',
      scope: {
        code: '=',
        soundStatus: '=',
        startTime: '=',
        youtubeUrl: '='
      },
      replace: true,
      template: '<div style="height:400px;"><iframe id="VideoPlayer" style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
      link: function(scope) {
        scope.$watch('code', function(newVal) {
          if (newVal) {
            scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal + '?autoplay=1');
            //scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal);
            var elem = angular.element(document.getElementById('VideoPlayer'))[0];
            var angElem = angular.element(elem)[0];
            console.log(elem);
            console.log(angElem);
            elem.triggerHandler('click');
            angElem.triggerHandler('click');
            //            angular.element(elem).triggerHandler('click');
          }
          /*
                  scope.$watch('youtubeUrl', function(newVal) {
                    if (newVal) {
                      scope.url = $sce.trustAsResourceUrl(newVal);
                    }
          */
        });
      },
      controller: function($scope, $log, $interval) {
        $interval(soundCtl, 1000);
/*
        $log.debug('directive');
        $log.debug($scope.startTime);
        var elem = angular.element(document.getElementById('VideoPlayer'))[0];
        var angElem = angular.element(elem)[0];
        console.log(elem);
        console.log(angElem);
        elem.triggerHandler('click');
        angElem.triggerHandler('click');
*/


        // var VideoPlayer = angular.element(element.getElementById("VideoPlayer"));
        // VideoPlayer.autoplay = true; 


        //var myvideo = document.getElementById('VideoPlayer');
        //myvideo.play();


        function soundCtl() {
          if ($scope.soundStatus === 'stop') {
            stopVideo();
          }
        }

        function stopVideo() {
          var iframe = document.getElementsByTagName('iframe')[0].contentWindow;
          iframe.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        }
      }
    };
  }
})();
