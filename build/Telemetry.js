"use strict";
exports.__esModule = true;
var Model_1 = require("./Model");
var APP_STARTED = 'APP_STARTED';
var Telemetry = /** @class */ (function () {
    function Telemetry(source, eventSink) {
        var _this = this;
        this.source = source;
        this.eventSink = eventSink;
        this.lastEvent = new Date();
        this.prepareSource();
        this.sayHello();
        setInterval(function () { return _this.heartBeat(); }, 120 * 1000);
    }
    Telemetry.prototype.trackEvent = function (name) {
        this.lastEvent = new Date();
        this.eventSink.trackEvent(name);
    };
    Telemetry.prototype.trackCustomEvent = function (event) {
        this.eventSink.trackCustomEvent(event);
    };
    Telemetry.prototype.trackError = function (error) {
        this.eventSink.trackError(error);
    };
    Telemetry.prototype.prepareSource = function () {
        var _this = this;
        this.source.onException(function (error) {
            _this.eventSink.trackError({ stack: error.stack, message: error.message, name: error.name, source: Model_1.ElectronEventSource.main });
        });
        this.eventSink.merge({
            system: this.source.systemInfo(),
            appVersion: this.source.appVersion()
        });
    };
    Telemetry.prototype.sayHello = function () {
        this.trackEvent(APP_STARTED);
        this.eventSink.commit();
    };
    Telemetry.prototype.heartBeat = function () {
        this.eventSink.merge({ heartbeat: 1 });
        this.eventSink.commit();
    };
    return Telemetry;
}());
exports.Telemetry = Telemetry;
//# sourceMappingURL=Telemetry.js.map