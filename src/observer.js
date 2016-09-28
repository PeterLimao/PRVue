var Dep = require('./dep').Dep;

var Observe = function(data) {
    if (!data || typeof data !== 'object') {
        return;
    }

    return new Observer(data);
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
            if (Dep.target) dep.depend();
            return value;
        },
        set: function(newValue) {
            value = newValue;
            dep.notify();
            //如果newValue是一个新的Object, 则需要进行转化
            Observe(newValue);
        }
    });
};

exports.Observe = Observe;
