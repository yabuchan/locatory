'use strict';

describe('Sounds E2E Tests:', function () {
  describe('Test Sounds page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sounds');
      expect(element.all(by.repeater('sound in sounds')).count()).toEqual(0);
    });
  });
});
