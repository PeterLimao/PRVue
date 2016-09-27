var Updater = require('./updater').Updater;
var Watcher = require('./watcher').Watcher;

var Compile = function(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    if (this.$el) {
        this.$fragment = this.nodeToFragment(this.$el);
        this.init();
        this.$el.appendChild(this.$fragment);
    }
};

Compile.prototype.init = function() {
    this.compileElement(this.$fragment);
};

Compile.prototype.isElementNode = function(node) {
    return node.nodeType === 1;
};

Compile.prototype.isTextNode = function(node) {
    return node.nodeType === 3;
}

Compile.prototype.compileElement = function(el) {
    var childNodes = el.childNodes;
    var _self = this;
    [].forEach.call(childNodes, function(node) {
        var text = node.textContent;
        //has bug {{ }}{{ }}
        var reg = /\{\{(.*)\}\}/;

        if (_self.isElementNode(node)) {
            _self.compile();
        } else if (_self.isTextNode(node) && reg.test(text)) {
            _self.compileText(node, RegExp.$1);
        }

        if (node.childNodes && node.childNodes.length) {
            _self.compileElement(node);
        }
    });
};

Compile.prototype.compile = function() {
    //TODO
};

Compile.prototype.compileText = function(node, exp) {
    CompileUtil.text(this.$vm, node, exp);
};

Compile.prototype.nodeToFragment = function(node) {
    var fragment = document.createDocumentFragment(), child;

    while (child = node.firstChild) {
        fragment.appendChild(child);
    }

    return fragment;
};

var CompileUtil = {
    text: function(vm, node, exp) {
        this.bind(vm, node, exp, 'text');
    },
    html: function() {
        //TODO
    },
    model: function() {
        //TODO
    },
    bind: function(vm, node, exp, type) {
        var updater = Updater[type + 'Updater'];
        //第一次数据更新
        if (updater) updater(node, this.getVmVal(vm, exp));
        //创建watcher
        new Watcher();
    },
    getVmVal: function(vm, exp) {
        var data = vm.$data;
        var exps = exp.split('.');
        //递归取值，知道取出正确的值
        exps.forEach(function(exp) {
            var trimExp = exp.trim();
            data = data[trimExp];
        });
        return data;
    }
};

exports.Compile = Compile;
