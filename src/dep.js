let uid = 0;

class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        if (this.subs.indexOf(sub) !== -1) this.subs.splice(index, 1);
    }

    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}

export { Dep };
