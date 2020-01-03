export class Card {
    constructor() {
        this.header = {};
        this.sections = [];
    }

    setTitle(title) {
        this.header = { title };
    }

    addSection(section) {
        this.sections.push(section);
    }

    getJson() {
        const card = {
            header: this.header,
            sections: this.sections
        };

        return {
            cards: [card]
        };
    }
}