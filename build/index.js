"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var ElectronTelemetrySource_1 = require("./ElectronTelemetrySource");
var HttpSink_1 = require("./sinks/http/HttpSink");
var Telemetry_1 = require("./Telemetry");
var electron_1 = require("electron");
var Model_1 = require("./Model");
var uuid_1 = require("uuid");
var TRACK_ERROR = 'telemetry/track/error';
var TRACK_EVENT = 'telemetry/track/event';
var TRACK_CUSTOM_EVENT = 'telemetry/track/custom_event';
exports.electronTelemetryFactory = function (appId, buildInfo) {
    var telemetryStorage = new ElectronTelemetrySource_1.ElectronStorage('data');
    var uuidStorage = new ElectronTelemetrySource_1.ElectronStorage('uuid');
    var uuid;
    try {
        uuid = uuidStorage.load();
    }
    catch (_a) {
        // ignore
    }
    if (!uuid) {
        uuid = uuid_1.v4();
        try {
            uuidStorage.persist(uuid);
        }
        catch (_b) {
            // ignore
        }
    }
    var httpSink = HttpSink_1.HttpSink.withStoredEvents(telemetryStorage, appId, uuid);
    var telemetry = new Telemetry_1.Telemetry(new ElectronTelemetrySource_1.ElectronTelemetrySource(buildInfo), httpSink);
    electron_1.ipcMain.on(TRACK_ERROR, function (event, error) {
        telemetry.trackError(__assign({}, error, { source: Model_1.ElectronEventSource.renderer }));
    });
    electron_1.ipcMain.on(TRACK_EVENT, function (event, name) {
        telemetry.trackEvent(name);
    });
    electron_1.ipcMain.on(TRACK_CUSTOM_EVENT, function (_e, event) {
        telemetry.trackCustomEvent(event);
    });
    return telemetry;
};
var ElectronRendererTelemetry = /** @class */ (function () {
    function ElectronRendererTelemetry() {
    }
    ElectronRendererTelemetry.prototype.registerErrorHandler = function () {
        if (typeof window !== 'undefined') {
            window.addEventListener('error', function (event) {
                electron_1.ipcRenderer.send(TRACK_ERROR, { stack: event.error.stack, message: event.error.message });
            });
            window.addEventListener('unhandledrejection', function (event) {
                electron_1.ipcRenderer.send(TRACK_ERROR, { stack: event.reason.stack, message: event.reason.message });
                console.warn("WARNING: Unhandled promise rejection. Reason: " + event.reason, event);
            });
        }
        this.trackLanguage();
    };
    ElectronRendererTelemetry.prototype.trackLanguage = function () {
        if (!navigator || !navigator.language) {
            return;
        }
        this.trackCustomEvent({ name: 'navigatorLanguage', payload: navigator.language });
    };
    ElectronRendererTelemetry.prototype.trackError = function (error) {
        electron_1.ipcRenderer.send(TRACK_ERROR, { name: error.name, stack: error.stack, message: error.message });
    };
    ElectronRendererTelemetry.prototype.trackCustomEvent = function (event) {
        electron_1.ipcRenderer.send(TRACK_CUSTOM_EVENT, event);
    };
    ElectronRendererTelemetry.prototype.trackEvent = function (name) {
        electron_1.ipcRenderer.send(TRACK_EVENT, name);
    };
    return ElectronRendererTelemetry;
}());
exports.electronRendererTelemetry = new ElectronRendererTelemetry();
//# sourceMappingURL=index.js.map