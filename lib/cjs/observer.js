"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
var Observer = /** @class */ (function () {
    function Observer() {
    }
    Observer.listen = function (name, callback) {
        if (!Observer.events[name]) {
            Observer.events[name] = [];
        }
        Observer.events[name].push(callback);
    };
    Observer.listeners = function (eventNames, callback) {
        if (eventNames === void 0) { eventNames = []; }
        if (eventNames.length === 0) {
            return;
        }
        eventNames.forEach(function (name) {
            Observer.listen(name, callback);
        });
    };
    Observer.dispatch = function (name, arg) {
        if (Observer.events[name]) {
            Observer.events[name].forEach(function (callback) {
                if (typeof arg !== 'undefined') {
                    callback.call(Observer, arg, name);
                }
                else {
                    callback.call(Observer, name);
                }
            });
        }
    };
    Observer.events = [];
    return Observer;
}());
exports.Observer = Observer;
