const db = require('../db');
const ValidationError = require('../ValidationError');
const ResultsCard = require('..../views/ResultsCard');

exports.response = async (message) => {
    try {
        const {sender, argumentText} = message || {};

        const messageCommand = argumentText.includes('\n') ? argumentText.trim().substring(0, argumentText.indexOf('\n')).trim() : argumentText.trim();
        const messageBody = argumentText.includes('\n') ? argumentText.substring(argumentText.indexOf('\n')).trim() : '';
        console.log('COMM: ' + messageCommand);
        console.log('BODY: ' + messageBody);

        if (messageCommand === 'dodaj wyniki') {
            const headerTitle = 'Wyniki ostatniego turnieju';
            const scores = await handleAddResults(messageBody);

            return new ResultsCard(headerTitle, scores).getJson();
        } else if (messageCommand === 'dodaj zawodnika') {
            return renderText(await handleAddPlayer(messageBody));
        } else if (messageCommand.startsWith('wyniki')) {
            const headerTitle = messageCommand.charAt(0).toUpperCase() + messageCommand.slice(1);
            const scores = await handleGetResults(messageCommand);

            return new ResultsCard(headerTitle, scores).getJson();
        }

        return renderText('Brak takiej komendy, spróbuj coś innego...');
    } catch (e) {
        console.log('ERROR response: ' + e);
        throw e;
    }
};

const handleGetResults = async (msgCommand) => {
    const availableCommandsHelpErrorMsg = 'Dostępne komendy: ```wyniki - ostatni dzień\nwyniki - ostatni tydzień\nwyniki - ostatni miesięc\nwyniki - ostatni rok```';

    let dateWhereClause = '';

    if (msgCommand === 'wyniki') {
        throw new ValidationError(availableCommandsHelpErrorMsg);
    } else {
        if (msgCommand.includes('ostatni dzień')) {
            dateWhereClause = '> CURRENT_DATE - 1';
        } else if (msgCommand.includes('ostatni tydzień')) {
            dateWhereClause = '> CURRENT_DATE - 7';
        } else if (msgCommand.includes('ostatni miesiąc')) {
            dateWhereClause = '> CURRENT_DATE - 30';
        } else if (msgCommand.includes('ostatni rok')) {
            dateWhereClause = '> CURRENT_DATE - 365';
        } else if (msgCommand.includes('od') && msgCommand.includes('do')) {
            const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
            const dateFromRegex = /od (.*) do/;
            const dateToRegex = /do (.*)/;

            const startDate = msgCommand.match(dateFromRegex)[1];
            const endDate = msgCommand.match(dateToRegex)[1];

            if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
                throw new ValidationError('Daty muszą być w formacie `YYYY-MM-DD`');
            }

            dateWhereClause = 'BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'';
        } else {
            throw new ValidationError(availableCommandsHelpErrorMsg);
        }
    }

    return await db.getScores(dateWhereClause);
};

const handleAddPlayer = async (msgBody) => {
    try {
        const playerChunks = msgBody.split(' ');

        if (playerChunks.length !== 3) {
            throw new ValidationError('Musisz podać imię, nazwisko oraz pseudonim!\nNa przykład: \`dodaj zawodnika Jan Kowalski kendokoluszki\`');
        }

        await db.createPlayer(playerChunks[0], playerChunks[1], playerChunks[2]);
        return `Dodano nowego ludzika - *${playerChunks[0]} '${playerChunks[2]}' ${playerChunks[1]}*`;
    } catch (e) {
        console.log('ERROR handleAddPlayer: ' + e);
        throw e;
    }
};

const handleAddResults = async (msgBody) => {
    try {
        const results = msgBody.split('\n').map(result => result.split('. ').pop());

        const playerScores = results.map((result, index) => {
            const resultChunks = result.split(' - ');
            const playoffChunks = resultChunks[1].split(' + ').slice(1);

            return {
                'place': ++index,
                'alias': resultChunks[0],
                'shoots': parseInt(resultChunks[1].split(' + ').shift()),
                'playoffShoots': playoffChunks.reduce((res, elem) => res + parseInt(elem), 0),
                'playoffRounds': playoffChunks.length
            }
        });

        await db.createScores(playerScores);
        return playerScores;
    } catch (e) {
        console.log('ERROR handleAddResults: ' + e);
        throw e;
    }

};

const renderText = (msg) => {
    return {
        'text': msg
    };
};

const renderResultsCard = (data) => {
    let response = {};
    response.cards = [];

    const card = {};
    card.header = renderCardHeader(data.cardTitle);
    card.sections = [
        renderResultsSection(data.data),
        renderButtonsSection()
    ];
    response.cards.push(card);

    return response;
};