var Observe = require('./observer').Observe;

var PRVue = function(options) {
    var options = options || {};
    this.$options = options;
    this.$data = this.$options.data;
    Observe(this.$options.data);
};

window.PRVue = PRVue;
