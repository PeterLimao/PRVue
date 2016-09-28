var uid = 0;

var Dep = function() {
    this.id = uid++;
    this.subs = [];
};

Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
};

Dep.prototype.removeSub = function(sub) {
    if (this.subs.indexOf(sub) !== -1) this.subs.splice(index, 1);
};

Dep.prototype.depend = function() {
    Dep.target.addDep(this);
}

Dep.prototype.notify = function() {
    this.subs.forEach(function(sub) {
        sub.update();
    });
};

exports.Dep = Dep;
