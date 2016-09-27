var Compile = function(el) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    if (this.$el) {
        this.$fragment = this.nodeToFragment(this.$el);
        console.log(this.$fragment);
        this.init();
        this.$el.appendChild(this.$fragment);
    }
};

Compile.prototype.isElementNode = function(node) {
    return node.nodeType === 1;
};

Compile.prototype.init = function() {

};

Compile.prototype.nodeToFragment = function(node) {
    var fragment = document.createDocumentFragment();
    var child = node.firstChild;

    if (child) {
        fragment.appendChild(child);
        child = child.firstChild;
    }

    return fragment;
};

exports.Compile = Compile;
