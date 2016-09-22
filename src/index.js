import Observer from './observer';

const PRVue = function(options = {}) {
    this.$options = options;
    new Observer(this.$options.data);

    this.data = this.$options.data;
};

window.PRVue = PRVue;
