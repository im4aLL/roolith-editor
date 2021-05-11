export class Observer {
    static events = [];

    static listen(name, callback) {
        if (!Observer.events[name]) {
            Observer.events[name] = [];
        }

        Observer.events[name].push(callback);
    }

    static listeners(eventNames = [], callback) {
        if (eventNames.length === 0) {
            return;
        }

        eventNames.forEach(name => {
            Observer.listen(name, callback);
        });
    }

    static dispatch(name, arg) {
        if (Observer.events[name]) {
            Observer.events[name].forEach(callback => {
                if (arg) {
                    callback.call(Observer, name, arg);
                } else {
                    callback.call(Observer, name);
                }
            });
        }
    }
}