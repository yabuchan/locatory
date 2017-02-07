(function () {
  'use strict';

  describe('Emotions Route Tests', function () {
    // Initialize global variables
    var $scope,
      EmotionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EmotionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EmotionsService = _EmotionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('emotions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/emotions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EmotionsController,
          mockEmotion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('emotions.view');
          $templateCache.put('modules/emotions/client/views/view-emotion.client.view.html', '');

          // create mock Emotion
          mockEmotion = new EmotionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Emotion Name'
          });

          // Initialize Controller
          EmotionsController = $controller('EmotionsController as vm', {
            $scope: $scope,
            emotionResolve: mockEmotion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:emotionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.emotionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            emotionId: 1
          })).toEqual('/emotions/1');
        }));

        it('should attach an Emotion to the controller scope', function () {
          expect($scope.vm.emotion._id).toBe(mockEmotion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/emotions/client/views/view-emotion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EmotionsController,
          mockEmotion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('emotions.create');
          $templateCache.put('modules/emotions/client/views/form-emotion.client.view.html', '');

          // create mock Emotion
          mockEmotion = new EmotionsService();

          // Initialize Controller
          EmotionsController = $controller('EmotionsController as vm', {
            $scope: $scope,
            emotionResolve: mockEmotion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.emotionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/emotions/create');
        }));

        it('should attach an Emotion to the controller scope', function () {
          expect($scope.vm.emotion._id).toBe(mockEmotion._id);
          expect($scope.vm.emotion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/emotions/client/views/form-emotion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EmotionsController,
          mockEmotion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('emotions.edit');
          $templateCache.put('modules/emotions/client/views/form-emotion.client.view.html', '');

          // create mock Emotion
          mockEmotion = new EmotionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Emotion Name'
          });

          // Initialize Controller
          EmotionsController = $controller('EmotionsController as vm', {
            $scope: $scope,
            emotionResolve: mockEmotion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:emotionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.emotionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            emotionId: 1
          })).toEqual('/emotions/1/edit');
        }));

        it('should attach an Emotion to the controller scope', function () {
          expect($scope.vm.emotion._id).toBe(mockEmotion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/emotions/client/views/form-emotion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
