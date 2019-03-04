"use strict";
exports.__esModule = true;
var electron = require("electron");
var fs = require("fs");
var path = require("path");
var os = require('os');
var os_1 = require("os");
var ElectronTelemetrySource = /** @class */ (function () {
    function ElectronTelemetrySource(buildInfo) {
        this.buildInfo = buildInfo;
    }
    ElectronTelemetrySource.prototype.systemInfo = function () {
        return {
            arch: os_1.arch(),
            platform: os_1.platform(),
            release: os.release(),
            package: this.buildInfo.package,
            packagePlatform: this.buildInfo.platform
        };
    };
    ElectronTelemetrySource.prototype.appVersion = function () {
        return electron.app.getVersion();
    };
    ElectronTelemetrySource.prototype.onException = function (callback) {
        process.on('unhandledRejection', function (error) {
            callback(error);
        });
        process.on('uncaughtException', function (error) {
            callback(error);
            console.error(error);
            try {
                electron.dialog.showMessageBox({
                    type: 'error',
                    buttons: ['Continue anyway', 'Crash'],
                    message: "The app has unexpectedly received an error, normal app behavior is no longer guaranteed. " + (error.stack || error.message),
                    title: error.name
                }, function (buttonIdx) {
                    if (buttonIdx === 1) {
                        process.exit(1);
                    }
                });
            }
            catch (error) {
                console.error('Can\'t show error dialog', error);
                setTimeout(function () { return process.exit(1); }, 3000);
            }
        });
    };
    return ElectronTelemetrySource;
}());
exports.ElectronTelemetrySource = ElectronTelemetrySource;
var ElectronStorage = /** @class */ (function () {
    function ElectronStorage(database) {
        this.database = database;
    }
    ElectronStorage.prototype.persist = function (data) {
        try {
            fs.writeFile(this.path(), data, {}, function () { });
        }
        catch (_a) {
            // ignore
        }
    };
    ElectronStorage.prototype.load = function () {
        try {
            return fs.readFileSync(this.path()).toString();
        }
        catch (_a) {
            return undefined;
        }
    };
    ElectronStorage.prototype.path = function () {
        return path.join(electron.app.getPath('appData'), electron.app.getName(), "electron-telemetry-" + this.database + ".json");
    };
    return ElectronStorage;
}());
exports.ElectronStorage = ElectronStorage;
//# sourceMappingURL=ElectronTelemetrySource.js.map