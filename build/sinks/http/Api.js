"use strict";
exports.__esModule = true;
var pako = require("pako");
var axios_1 = require("axios");
if (!axios_1["default"].defaults.transformRequest) {
    axios_1["default"].defaults.transformRequest = [];
}
else if (!Array.isArray(axios_1["default"].defaults.transformRequest)) {
    axios_1["default"].defaults.transformRequest = [axios_1["default"].defaults.transformRequest];
}
var api = axios_1["default"].create({
    withCredentials: true,
    transformRequest: axios_1["default"].defaults.transformRequest.concat(function (data, headers) {
        // compress strings if over 1KB
        if (typeof data === 'string' /* && data.length > 1024*/) {
            headers['Content-Encoding'] = 'gzip';
            var encoded = Buffer.from(pako.gzip(data));
            return encoded;
        }
        else {
            // delete is slow apparently, faster to set to undefined
            headers['Content-Encoding'] = undefined;
            return data;
        }
    })
});
exports["default"] = api;
//# sourceMappingURL=Api.js.map