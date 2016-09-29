var Dep = require('./dep').Dep;

/**
 * Watcher实例入口,
 * @param  {Object}   vm       对应的PRVue实例
 * @param  {String}   exp      表达式 {{a.b.c}}
 * @param  {Function} callback 回调函数，用于触发数据更新
 */
var Watcher = function(vm, exp, callback) {
    this.vm = vm;
    this.exp = exp;
    this.callback = callback;
    this.depsId = {};
    this.value = this.get();
};

var p = Watcher.prototype;

p.update = function() {
    var newValue = this.get();
    var oldValue = this.value;
    if (newValue !== oldValue) {
        this.value = newValue;
        this.callback.call(this.vm, newValue, oldValue);
    }
};

p.addDep = function(dep) {
    if (!this.depsId.hasOwnProperty(dep.id)) {
        dep.addSub(this);
        this.depsId[dep.id] = dep;
    }
}

/**
 * 获取需要watch的数据, 并让dep持有watcher实例的引用，方便dep push watcher
 * @return {String} 值
 */
p.get = function() {
    Dep.target = this;
    var value = this.getVmVal();
    Dep.target = null;

    return value;
};

/**
 * 递归exp, 取得value, 并触发getter, push watcher
 * @return {data} 值
 */
p.getVmVal = function() {
    var data = this.vm.data;
    var exps = this.exp.split('.');

    exps.forEach(function(exp) {
        var expTrim = exp.trim();
        data = data[expTrim];
    });

    return data;
};

exports.Watcher = Watcher;
