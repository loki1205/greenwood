/*
 * Use Case
 * Run Greenwood with Google Analytics composite plugin.
 * 
 * Uaer Result
 * Should generate an error when not passing in a valid analyticsId.
 * 
 * User Command
 * greenwood build
 * 
 * User Config
 * const googleAnalyticsPlugin = require('@greenwod/plugin-google-analytics');
 * 
 * {
 *   plugins: [{
 *     ...googleAnalyticsPlugin()
 *  }]
 * 
 * }
 * 
 * User Workspace
 * Greenwood default (src/)
 */
const expect = require('chai').expect;
const TestBed = require('../../../../../test/test-bed');

describe('Build Greenwood With: ', async function() {
  let setup;

  before(async function() {
    setup = new TestBed();
    this.context = setup.setupTestBed(__dirname);
  });
    
  describe('Google Analytics Plugin with a bad value for analyticsId', () => {
    it('should throw an error that analyticsId must be a string', async () => {
      try { 
        await setup.runGreenwoodCommand('build');
      } catch (err) {
        expect(err).to.contain('analyticsId should be of type string.  get "undefined" instead.');
      }
    });
  });
  
  after(function() {
    setup.teardownTestBed();
  });

});