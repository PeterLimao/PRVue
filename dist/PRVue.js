/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Observe = __webpack_require__(2).Observe;
	var Compile = __webpack_require__(4).Compile;

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Dep = __webpack_require__(3).Dep;

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


/***/ },
/* 3 */
/***/ function(module, exports) {

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
	    console.log('id: ' + this.id);
	}

	p.notify = function() {
	    this.subs.forEach(function(sub) {
	        sub.update();
	    });
	};

	exports.Dep = Dep;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Updater = __webpack_require__(5).Updater;
	var Watcher = __webpack_require__(6).Watcher;

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


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Updater = {
	    textUpdater: function(node, value) {
	        node.textContent = value;
	    }
	};

	exports.Updater = Updater;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Dep = __webpack_require__(3).Dep;

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


/***/ }
/******/ ]);
//# sourceMappingURL=PRVue.js.map