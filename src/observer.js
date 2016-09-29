var Dep = require('./dep').Dep;

/**
 * observe入口, 验证data数据，并创建实例
 * @param  {Object} data
 */
var Observe = function(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    new Observer(data);
};

/**
 * Observer实例的构造方法, 绑定需要订阅的data, 并执行逻辑
 * @param  {Object} data
 */
var Observer = function(data) {
    this.data = data;
    this.dep = new Dep();
    this.start();
};

var p = Observer.prototype;

/**
 * 枚举data属性, 转化为getter, setter
 */
p.start = function() {
    var _self = this;
    Object.keys(this.data).forEach(function(key) {
        _self.defineProperty(_self.data, key, _self.data[key]);
    });
};

/**
 * getter, setter转化方法, 并对应一个deps实例
 * get触发时候添加一个Watcher到deps
 * set触发时候通知deps的Watcher有数据更新
 * @param  {Object} data
 * @param  {String} key
 * @param  {String or Object} value
 */
p.defineProperty = function(data, key, value) {
    //判断value是否是object,如果也是，递归处理，转化成getter, setter
    Observe(value);

    var _self = this;

    Object.defineProperty(data, key, {
        configurable: false,
        enumerable: true,
        get: function() {
            //只有当watcher被实例化后，才能push Watcher
            if (Dep.target) _self.dep.depend();
            return value;
        },
        set: function(newValue) {
            _self.dep.notify();
            //如果newValue是一个新的Object, 则需要转化为getter, setter
            Observe(newValue);

            value = newValue;
        }
    });
};

exports.Observe = Observe;
