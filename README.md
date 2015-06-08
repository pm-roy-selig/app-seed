# app-seed
A starter app for building PMCC-based AngularJS applications.


## Setup
Install NodeJS globally. Install BowerJS globally. 

In Terminal...

1. run `npm install`
2. run `bower install`

To launch the web server and view the landing page in your browser...

3. run `node web-server`


## E2E Testing
1. Install E2E testing via Protractor: `sudo npm install -g protractor`
2. Install `sudo webdriver-manager update`

To Run E2E tests,
1. add the path to your test spec in tests\e2e-conf.js.
2. start the web server via `node web-server`.
3. start selenium web driver via `webdriver-manager start`.
4. run the test suite via `protractor tests\e2e-conf`
