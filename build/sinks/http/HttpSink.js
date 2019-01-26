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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var config_1 = require("../../config");
var Api_1 = require("./Api");
var uuid_1 = require("uuid");
var HttpSink = /** @class */ (function () {
    function HttpSink(messages, persistence, appId, uuid) {
        this.transactions = messages;
        this.persistence = persistence;
        this.appId = appId;
        this.uuid = uuid;
    }
    HttpSink.prototype.getCurrentMessage = function () {
        this.ensureMessageExists();
        var lastIndex = this.transactions.length - 1;
        return this.transactions[lastIndex];
    };
    HttpSink.prototype.setCurrentMessage = function (message) {
        this.ensureMessageExists();
        var lastIndex = this.transactions.length - 1;
        this.transactions[lastIndex] = message;
    };
    HttpSink.prototype.ensureMessageExists = function () {
        if (this.transactions.length === 0) {
            this.createNewTransaction();
        }
    };
    HttpSink.prototype.createNewTransaction = function () {
        this.transactions.push({});
    };
    HttpSink.prototype.merge = function (message) {
        if (this.getCurrentMessage().transactionId) {
            this.createNewTransaction();
            return;
        }
        this.setCurrentMessage(__assign({}, this.getCurrentMessage(), message));
    };
    HttpSink.prototype.hasData = function () {
        try {
            // Todo, Object.keys().length should be faster
            return JSON.stringify(this.getCurrentMessage()) !== '{}';
        }
        catch (_a) {
            // Clear if it can't be serialized
            // Todo, maybe move to publish
            this.setCurrentMessage({});
        }
        return false;
    };
    HttpSink.prototype.trackCustomEvent = function (event) {
        var message = this.getCurrentMessage();
        if (!message.customEvents) {
            message.customEvents = [];
        }
        event.time = Date.now();
        message.customEvents.push(event);
    };
    HttpSink.prototype.trackEvent = function (eventName) {
        var message = this.getCurrentMessage();
        if (!message.events) {
            message.events = {};
        }
        if (!Array.isArray(message.events[eventName])) {
            message.events[eventName] = [];
        }
        message.events[eventName].push(Date.now());
    };
    HttpSink.prototype.trackError = function (error) {
        console.error(error);
        var message = this.getCurrentMessage();
        if (!Array.isArray(message.errors)) {
            message.errors = [];
        }
        message.errors.push({
            time: Date.now(),
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        this.commit();
    };
    HttpSink.withStoredEvents = function (persistence, appId, uuid) {
        try {
            var data = persistence.load();
            if (data) {
                var parsedJson = JSON.parse(data);
                if (!Array.isArray(parsedJson)) {
                    parsedJson = [];
                }
                return new HttpSink(parsedJson, persistence, appId, uuid);
            }
        }
        catch (_a) {
            // ignore io errors
        }
        return new HttpSink([], persistence, appId, uuid);
    };
    HttpSink.prototype.commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasData()) {
                            return [2 /*return*/];
                        }
                        this.merge({
                            committed: Date.now(),
                            uuid: this.uuid,
                            transactionId: uuid_1.v4(),
                            protocol: 1
                        });
                        this.store();
                        this.transactions.forEach(function (transaction) {
                            transaction.sent = Date.now();
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Api_1["default"].post(config_1["default"].telemetryHost + "/app/" + this.appId, this.transactions)];
                    case 2:
                        _a.sent();
                        this.transactions = [];
                        this.store();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.warn(error_1);
                        // clean up
                        this.transactions.forEach(function (transaction) {
                            transaction.sent = undefined;
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HttpSink.prototype.store = function () {
        try {
            this.persistence.persist(JSON.stringify(this.transactions));
        }
        catch (_a) {
            // ignore io errors
        }
    };
    return HttpSink;
}());
exports.HttpSink = HttpSink;
//# sourceMappingURL=HttpSink.js.map