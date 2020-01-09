const TextView = require('../views/TextView');

module.exports = class HelpController {
    constructor() {}

    getResults() {
        const helpMessage = `Dostępne komendy:\`\`\`
- wyniki - [ostatni dzień | ostatni tydzień | ostatni miesiąc | ostatni rok | od YYYY-MM-DD do YYYY-MM-DD]
- najwięcej rzutów - [miesiąc | rok]
- najwięcej wygranych - [miesiąc | rok]
- najwiecej przegranych - [miesiac | rok]
- seria wygranych
- seria przegranych
    
- dodaj zawodnika IMIĘ NAZWISKO ALIAS
- dodaj wyniki\`\`\``;

        return new TextView(helpMessage).getJson();
    }
};