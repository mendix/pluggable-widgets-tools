const {spawnSync} = require('child_process');

describe("Generating command line tests", function() {
    beforeAll(() => {
        spawnSync('npm', ['link'], {cwd: "../"});
    });

    describe("Commands for Hybrid and Web apps", () => {
        it(`Testing start:server command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["start:server"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "start:server"`);
        });

        it(`Testing start:ts command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["start:ts"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "start:ts"`);
        });

        it(`Testing start:js command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["start:js"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "start:js"`);
        });

        it(`Testing build:ts command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["build:ts"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "build:ts"`);
        });

        it(`Testing build:js command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["build:js"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "build:js"`);
        });

        it(`Testing start:ts command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["start:ts"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "start:ts"`);
        });

        it(`Testing dev:js command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["dev:js"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "dev:js"`);
        });

        it(`Testing dev:ts command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["dev:ts"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "dev:ts"`);
        });

        it(`Testing release:js command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["release:js"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "release:js"`);
        });

        it(`Testing test:unit command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["test:unit"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "test:unit"`);
        });
    });

    describe("Commands for Native apps", () => {
        it(`Testing start:ts:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["start:ts:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "start:ts:native"`);
        });

        it(`Testing start:js:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["start:js:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "start:js:native"`);
        });

        it(`Testing build:ts:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["build:ts:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "build:ts:native"`);
        });

        it(`Testing build:js:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["build:js:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "build:js:native"`);
        });

        it(`Testing start:ts:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["start:ts:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "start:ts:native"`);
        });

        it(`Testing dev:js:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["dev:js:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "dev:js:native"`);
        });

        it(`Testing dev:ts:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["dev:ts:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "dev:ts:native"`);
        });

        it(`Testing release:js:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["release:js:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "release:js:native"`);
        });

        it(`Testing test:unit:native command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["test:unit:native"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "test:unit:native"`);
        });
    });

    describe("Testing generic commands", () => {
        it(`Testing lint command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["lint"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "lint"`);
        });

        it(`Testing lint:fix command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["lint:fix"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "lint:fix"`);
        });

        it(`Testing format command`, function() {
            const proc = spawnSync('pluggable-widgets-tools', ["format"], {cwd: "../"});
            expect(proc.stdout.toString()).toContain(`Running MX Widget Tools script: "format"`);
        });
    });
});
