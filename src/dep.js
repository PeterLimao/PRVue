var uid = 0;

var Dep = function() {
    this.id = uid++;
    this.subs = [];
};

var p = Dep.prototype;

p.addSub = function (sub) {
    this.subs.push(sub);
};

p.removeSub = function(sub) {
    if (this.subs.indexOf(sub) !== -1) this.subs.splice(index, 1);
};

p.depend = function() {
    Dep.target.addDep(this);
}

p.notify = function() {
    this.subs.forEach(function(sub) {
        sub.update();
    });
};

exports.Dep = Dep;
