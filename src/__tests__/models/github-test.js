// __tests__/models/github-test.js
jest.dontMock('../../js/models/github');
var github = require('../../js/models/github');

describe('github model', function() {
 it('should be an object', function() {
   expect(github).toBeDefined();
 });
});