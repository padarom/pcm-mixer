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
var lib_1 = require("../lib");
var aop = {
    channels: 2,
    bitDepth: 32,
    samplingRate: 44100,
    float: true,
    signed: true
};
var floatSum = function (inputs, length) {
    if (typeof length === "undefined" && inputs.length) {
        length = inputs[0].length;
    }
    var buffer = Buffer.allocUnsafe(length);
    var summingView = new DataView(buffer.buffer);
    var inputViews = inputs.map(function (_a) {
        var buffer = _a[0], volume = _a[1];
        return new DataView(buffer.buffer);
    });
    var _loop_1 = function (i) {
        var value = inputs.reduce(function (previousValue, input, index) {
            return previousValue + inputViews[index].getFloat32(i, true) * input[1];
        }, 0);
        summingView.setFloat32(i, value, true);
    };
    for (var i = 0; i < summingView.byteLength - 4; i += 4) {
        _loop_1(i);
    }
    return buffer;
};
var m = new lib_1["default"](aop, floatSum);
var track1 = m.input(__assign({ volume: 0.5 }, aop));
var track2 = m.input(__assign({ volume: 0.5 }, aop));
var fss = require("fs").createWriteStream("output.pcm");
setInterval(function () {
    var d = m.read((44100 * 2 * 4) / 10);
    fss.write(d); //.write(fss);
}, 100);
var dv = new DataView(Buffer.allocUnsafe(2048).buffer);
for (var i = 0; i < 2048; i += 4) {
    dv.setFloat32(i, Math.random(), true);
}
setInterval(function () {
    track1.write(new Uint8Array(dv.buffer));
}, 400);
setInterval(function () {
    track2.write(new Uint8Array(dv.buffer));
}, 300);
m.start();
setTimeout(function () {
    process.exit(0);
}, 2000);
