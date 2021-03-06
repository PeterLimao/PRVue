var Observe = require('./observer').Observe;
var Compile = require('./compile').Compile;

/**
 * PRVue实例入口
 * @param  {Object} options [实例参数]
 */
var PRVue = function(options) {
    this.options = options || {};
    var data = this.data = this.options.data;

    //代理vm.data.xxx, 便于用vm.xxxx访问
    var _self = this;
    Object.keys(data).forEach(function(key) {
        _self.proxy(key);
    });
    //创建Obsever实例
    Observe(this.data);
    //创建Compiler实例
    new Compile(this.options.el, this);
};

var p = PRVue.prototype;

/**
 * vm.$data的代理方法,通过vm.x来访问vm.$data.x
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
p.proxy = function(key) {
    Object.defineProperty(this, key, {
        configurable: false,
        enumerable: true,
        get: function() {
            return this.data[key];
        },
        set: function(newValue) {
            this.data[key] = newValue;
        }
    })
};

window.PRVue = PRVue;
