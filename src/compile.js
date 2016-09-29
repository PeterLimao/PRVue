var Updater = require('./updater').Updater;
var Watcher = require('./watcher').Watcher;

/**
 * Complie入口，初始化Complie实例，绑定vm和el
 * @param  {String} el 模板id (#app)
 * @param  {vm} vm PRVue实例
 */
var Compile = function(el, vm) {
    this.vm = vm;
    this.el = this.isElementNode(el) ? el : document.querySelector(el);

    //将el转化为document fragment, 并解析模板(目前只解析了文本节点)
    if (this.el) {
        this.fragment = this.nodeToFragment(this.el);
        this.init();
        this.el.appendChild(this.fragment);
    }
};

var p = Compile.prototype;

/**
 * 初始化，解析document fragment
 */
p.init = function() {
    this.compileElement(this.fragment);
};

p.nodeToFragment = function(node) {
    var fragment = document.createDocumentFragment(), child;

    while (child = node.firstChild) {
        fragment.appendChild(child);
    }

    return fragment;
};

/**
 * 递归解析document fragment 并且为每个文本节点({{ }})实例化watcher, 并且初始化文本节点数据
 * @param  {Object} el
 */
p.compileElement = function(el) {
    var childNodes = el.childNodes;
    var _self = this;
    [].forEach.call(childNodes, function(node) {
        var text = node.textContent;
        //has bug {{ }}{{ }}
        var reg = /\{\{(.*)\}\}/;

        if (_self.isTextNode(node) && reg.test(text)) {
            _self.compileText(node, RegExp.$1);
        }
        //递规处理其子节点
        if (node.childNodes && node.childNodes.length) {
            _self.compileElement(node);
        }
    });
};

p.compileText = function(node, exp) {
    CompileUtil.text(this.vm, node, exp);
};

p.isElementNode = function(node) {
    return node.nodeType === 1;
};

p.isTextNode = function(node) {
    return node.nodeType === 3;
}

var CompileUtil = {
    text: function(vm, node, exp) {
        this.bind(vm, node, exp, 'text');
    },
    bind: function(vm, node, exp, type) {
        var updater = Updater[type + 'Updater'];
        //第一次数据更新
        if (updater) updater(node, this.getVmVal(vm, exp));
        //创建watcher
        new Watcher(vm, exp, function(value, oldValue) {
            if (updater) updater(node, value, oldValue);
        });
    },
    getVmVal: function(vm, exp) {
        var data = vm.data;
        var exps = exp.split('.');
        //递归取值，直到取出正确的值
        exps.forEach(function(exp) {
            var trimExp = exp.trim();
            data = data[trimExp];
        });
        return data;
    }
};

exports.Compile = Compile;
