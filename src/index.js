var Observe = require('./observer').Observe;
var Compile = require('./compile').Compile;

var PRVue = function(options) {
    this.$options = options || {};
    var data = this.$data = this.$options.data;

    var _self = this;
    Object.keys(data).forEach(function(key) {
        _self.proxy(key);
    });

    Observe(data);
    new Compile(this.$options.el);
};

PRVue.prototype.proxy = function(key) {
    Object.defineProperty(this, key, {
        configurable: false,
        enumerable: true,
        get: function() {
            return this.$data[key];
        },
        set: function(newValue) {
            this.$data[key] = newValue;
        }
    })
};

window.PRVue = PRVue;
