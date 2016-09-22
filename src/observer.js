const observer = function(data) {
    if (!data || typeof data !== 'object') {
        console.error('data can\'t be null');
        return;
    }

    this.data = data;

    Object.keys(data).forEach((key) => {
        this.defineProperty(key, data[key]);
    });
};

observer.prototype.defineProperty = function(key, value) {
    if (typeof value === 'object') {
        observer(value);
    }

    Object.defineProperty(this.data, key, {
        configurable: false,
        enumerable: true,
        get () {
            return value;
        },
        set (newValue) {
            value = newValue;
        }
    });
};

export default observer;
