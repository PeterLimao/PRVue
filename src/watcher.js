var Dep = require('./dep').Dep;

var Watcher = function(vm, exp, callback) {
    this.vm = vm;
    this.exp = exp;
    this.callback = callback;
    this.depId;
    this.value = this.get();
};

Watcher.prototype.update = function() {
    var newValue = this.get();
    var oldValue = this.value;
    if (newValue !== oldValue) {
        this.value = newValue;
        this.callback.call(this.vm, newValue, oldValue);
    }
};

Watcher.prototype.addDep = function(dep) {
    if (this.depId !== dep.id) {
        dep.addSub(this);
        this.depId = dep.id;
    }
}

Watcher.prototype.get = function() {
    Dep.target = this;
    var value = this.getVmVal();
    Dep.target = null;

    return value;
};

Watcher.prototype.getVmVal = function() {
    var data = this.vm.data;
    var exps = this.exp.split('.');

    exps.forEach(function(exp) {
        var expTrim = exp.trim();
        data = data[expTrim];
    });

    return data;
};

exports.Watcher = Watcher;
