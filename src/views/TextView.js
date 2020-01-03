module.exports = class TextView {
    constructor(text) {
        this.text = text;
    }

    getJson() {
        return {
            text: this.text
        }
    }
};