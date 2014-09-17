// __tests__/models/github-test.js
jest.dontMock('../../js/table/handsontable.csv.js');
var csv = require('../../js/table/handsontable.csv.js');

describe('handsontable csv helper', function() {
  it('should be an object', function() {
    expect(csv).toBeDefined();
  });

  it('export some helper methods', function() {
    expect(csv.makeHeader).toBeDefined();
    expect(csv.makeColumns).toBeDefined();
    expect(csv.string).toBeDefined();
    expect(csv.download).toBeDefined();
  });
});

