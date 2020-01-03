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
        bodySection.widgets = data.map(callback);

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

    renderTextButton(buttonName, actionMethodName, actionType) {
        let button = {};
        button.textButton = {};
        button.textButton.text = buttonName;
        button.textButton.onClick = {};
        button.textButton.onClick.action = {};
        button.textButton.onClick.action.actionMethodName = actionMethodName;
        button.textButton.onClick.action.parameters = [
            {
                key: 'period',
                value: actionType
            }
        ];

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