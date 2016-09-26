import { Dep } from './dep';

const Observe = function(data) {
    if (!data || typeof data !== 'object') {
        return;
    }

    new Observer(data);
};

class Observer {
    constructor(data) {
        this.data = data;
        this.start();
    }

    start() {
        Object.keys(this.data).forEach((key) => {
            this.defineProperty(this.data, key, this.data[key]);
        });
    }

    defineProperty(data, key, value) {
        let dep = new Dep();

        Observe(value);

        Object.defineProperty(data, key, {
            configurable: false,
            enumerable: true,
            get () {
                return value;
            },
            set (newValue) {
                console.log('监听变化: value->' + value + ' newValue->' + newValue);
                value = newValue;
                dep.notify();
            }
        });
    }
}

export { Observe };
