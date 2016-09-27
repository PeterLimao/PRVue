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
	    this.$options = options || {};
	    var data = this.$data = this.$options.data;

	    var _self = this;
	    Object.keys(data).forEach(function(key) {
	        _self.proxy(key);
	    });
	    //创建Obsever实例
	    Observe(data);
	    //创建Compiler实例
	    new Compile(this.$options.el, this);
	};

	/**
	 * vm.$data的代理方法,通过vm.x来访问vm.$data.x
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	PRVue.prototype.proxy = function(key) {
	    Object.defineProperty(this, key, {
	        configurable: false,
	        enumerable: true,
	        get: function() {
	            return this.$data[key];
	        },
	        set: function(newValue) {
	            this.$data[key] = newValue;
	        }
	    })
	};

	window.PRVue = PRVue;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Dep = __webpack_require__(3).Dep;

	var Observe = function(data) {
	    if (!data || typeof data !== 'object') {
	        return;
	    }

	    new Observer(data);
	};

	var Observer = function(data) {
	    this.data = data;
	    this.start();
	};

	Observer.prototype.start = function() {
	    var _self = this;
	    Object.keys(this.data).forEach(function(key) {
	        _self.defineProperty(_self.data, key, _self.data[key]);
	    });
	};

	Observer.prototype.defineProperty = function(data, key, value) {
	    var dep = new Dep();

	    Observe(value);

	    Object.defineProperty(data, key, {
	        configurable: false,
	        enumerable: true,
	        get: function() {
	            return value;
	        },
	        set: function(newValue) {
	            console.log('监听变化: value->' + value + ' newValue->' + newValue);
	            value = newValue;
	            dep.notify();
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

	Dep.prototype.addSub = function (sub) {
	    this.subs.push(sub);
	};

	Dep.prototype.removeSub = function(sub) {
	    if (this.subs.indexOf(sub) !== -1) this.subs.splice(index, 1);
	};

	Dep.prototype.notify = function() {
	    this.subs.forEach(function(sub) {
	        sub.update();
	    });
	};

	exports.Dep = Dep;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Updater = __webpack_require__(6).Updater;
	var Watcher = __webpack_require__(7).Watcher;

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


/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	var Updater = {
	    textUpdater: function(node, value) {
	        node.textContent = value;
	    }
	};

	exports.Updater = Updater;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var Watcher = function() {};

	exports.Watcher = Watcher;


/***/ }
/******/ ]);
//# sourceMappingURL=PRVue.js.map