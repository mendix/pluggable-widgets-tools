const debug = process.env.DEBUG;
const url = process.env.URL || "https://localhost:8080/";

exports.config = {
    host: "127.0.0.1",
    port: 4444,
    specs: [ "../../../dist/e2e/**/*.spec.js","../../../dist/e2e/**/*.spec.ts" ],
    maxInstances: debug ? 1 : 5,
    capabilities: [ {
        maxInstances: debug ? 1 : 5,
        browserName: "chrome"
    } ],
    sync: true,
    logLevel: "silent",
    coloredLogs: true,
    bail: 0,
    screenshotPath: "../../../dist/e2e/",
    baseUrl: url,
    waitforTimeout: 30000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 0,
    services: [ "selenium-standalone" ],
    framework: "jasmine",
    reporters: [ "spec" ],
    execArgv: debug ? [ "--inspect" ] : undefined,
    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: debug ? (60 * 60 * 1000) : (30 * 1000),
        expectationResultHandler: function(passed, assertion) {
            if (passed) {
                return;
            }
            browser.saveScreenshot(
                "../../../dist/e2e/assertionError_" + assertion.error.message + ".png"
            );
        }
    }
};
