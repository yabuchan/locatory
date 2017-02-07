'use strict';

describe('Emotions E2E Tests:', function () {
  describe('Test Emotions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/emotions');
      expect(element.all(by.repeater('emotion in emotions')).count()).toEqual(0);
    });
  });
});
