var Dep = require('./dep').Dep;

var Observe = function(data) {
    if (!data || typeof data !== 'object') {
        return;
    }

    new Observer(data);
};

var Observer = function(data) {
    this.data = data;
    this.start();
};

Observer.prototype.start = function() {
    var _self = this;
    Object.keys(this.data).forEach(function(key) {
        _self.defineProperty(_self.data, key, _self.data[key]);
    });
};

Observer.prototype.defineProperty = function(data, key, value) {
    var dep = new Dep();

    Observe(value);

    Object.defineProperty(data, key, {
        configurable: false,
        enumerable: true,
        get: function() {
            return value;
        },
        set: function(newValue) {
            console.log('监听变化: value->' + value + ' newValue->' + newValue);
            value = newValue;
            dep.notify();
        }
    });
};

exports.Observe = Observe;
