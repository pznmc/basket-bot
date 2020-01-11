module.exports = class CardView {
    constructor() {
        this.header = {};
        this.sections = [];
    }

    setTitle(title) {
        this.header = { title };
    }

    addBodySection(data, callback) {
        let bodySection = {};

        if (Object.prototype.toString.call(callback) == '[object Function]') {
            bodySection.widgets = data.map(callback);
        } else {
            console.log('WEJSZLO');
            bodySection.widgets = data;
        }

        this.sections.push(bodySection);
    }

    addButtonsSection(buttons) {
        let buttonsSection = {
            widgets: [
                {
                    buttons: buttons
                }
            ]
        };

        this.sections.push(buttonsSection);
    }

    renderTextButton(buttonName, command) {
        let button = {};
        button.textButton = {};
        button.textButton.text = buttonName;
        button.textButton.onClick = {};
        button.textButton.onClick.action = {};
        button.textButton.onClick.action.actionMethodName = command;

        return button;
    };

    getJson() {
        const card = {
            header: this.header,
            sections: this.sections
        };

        return {
            cards: [card]
        };
    }
};