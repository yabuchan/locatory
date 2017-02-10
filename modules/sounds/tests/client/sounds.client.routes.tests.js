(function () {
  'use strict';

  describe('Sounds Route Tests', function () {
    // Initialize global variables
    var $scope,
      SoundsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SoundsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SoundsService = _SoundsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sounds');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sounds');
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
          SoundsController,
          mockSound;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sounds.view');
          $templateCache.put('modules/sounds/client/views/view-sound.client.view.html', '');

          // create mock Sound
          mockSound = new SoundsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sound Name'
          });

          // Initialize Controller
          SoundsController = $controller('SoundsController as vm', {
            $scope: $scope,
            soundResolve: mockSound
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:soundId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.soundResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            soundId: 1
          })).toEqual('/sounds/1');
        }));

        it('should attach an Sound to the controller scope', function () {
          expect($scope.vm.sound._id).toBe(mockSound._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sounds/client/views/view-sound.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SoundsController,
          mockSound;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sounds.create');
          $templateCache.put('modules/sounds/client/views/form-sound.client.view.html', '');

          // create mock Sound
          mockSound = new SoundsService();

          // Initialize Controller
          SoundsController = $controller('SoundsController as vm', {
            $scope: $scope,
            soundResolve: mockSound
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.soundResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sounds/create');
        }));

        it('should attach an Sound to the controller scope', function () {
          expect($scope.vm.sound._id).toBe(mockSound._id);
          expect($scope.vm.sound._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sounds/client/views/form-sound.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SoundsController,
          mockSound;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sounds.edit');
          $templateCache.put('modules/sounds/client/views/form-sound.client.view.html', '');

          // create mock Sound
          mockSound = new SoundsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sound Name'
          });

          // Initialize Controller
          SoundsController = $controller('SoundsController as vm', {
            $scope: $scope,
            soundResolve: mockSound
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:soundId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.soundResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            soundId: 1
          })).toEqual('/sounds/1/edit');
        }));

        it('should attach an Sound to the controller scope', function () {
          expect($scope.vm.sound._id).toBe(mockSound._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sounds/client/views/form-sound.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
