const db = require('../db');
const util = require('../util');
const ValidationError = require('../ValidationError');
const MostLostSeriesCardView = require('../views/MostLostSeriesCardView');
const MostShootsByPeriodCardView = require('../views/MostShootsByPeriodCardView');
const MostShootsByPlayerCardView = require('../views/MostShootsByPlayerCardView');
const MostWinsByPeriodCardView = require('../views/MostWinsByPeriodCardView');
const MostWinsByPlayerCardView = require('../views/MostWinsByPlayerCardView');
const MostWinsSeriesCardView = require('../views/MostWinsSeriesCardView');
const ResultsCardView = require('../views/ResultsCardView');
const TextView = require('../views/TextView');

exports.response = async (message) => {
    try {
        const { argumentText } = message || {};

        // Get command when text is multiline or not
        let messageCommand = argumentText.includes('\n') ? argumentText.trim().substring(0, argumentText.indexOf('\n')).trim() : argumentText.trim();

        // Remove diacritic characters
        messageCommand = messageCommand.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0142/g, 'l');

        // Get message body only when entire text is multiline
        const messageBody = argumentText.includes('\n') ? argumentText.substring(argumentText.indexOf('\n')).trim() : '';
        console.log('COMM: ' + messageCommand);
        console.log('BODY: ' + messageBody);

        if (messageCommand === 'dodaj wyniki') {
            return await handleAddResults(messageBody);
        } else if (messageCommand === 'dodaj zawodnika') {
            return await handleAddPlayer(messageBody);
        } else if (messageCommand.startsWith('wyniki')) {
            return await handleGetResults(messageCommand);
        } else if (messageCommand.startsWith('najwiecej rzutow')) {
            return await handleGetMostShoots(messageCommand);
        } else if (messageCommand.startsWith('najwiecej wygranych')) {
            return await handleGetMostWins(messageCommand);
        } else if (messageCommand.startsWith('seria wygranych')) {
            return await handleGetMostWinsSeries(messageCommand);
        } else if (messageCommand.startsWith('seria przegranych')) {
            return await handleGetMostLostSeries(messageCommand);
        } else if (messageCommand === 'pomoc') {
            return handleHelpCommand();
        }

        return new TextView('Brak takiej komendy, spróbuj coś innego...').getJson();
    } catch (e) {
        console.log('ERROR response: ' + e);
        throw e;
    }
};

const handleGetResults = async (msgCommand) => {
    const availableCommandsHelpErrorMsg = 'Dostępne komendy: ```wyniki\nwyniki - ostatni dzień\nwyniki - ostatni tydzień\nwyniki - ostatni miesięc\nwyniki - ostatni rok```';

    let dateWhereClause = '';
    let headerTitle;
    let scores;

    if (msgCommand === 'wyniki') {
        headerTitle = 'Wyniki ostatniego konkursu';
        scores = await db.getScoresRecent();
    } else {
        headerTitle = msgCommand.charAt(0).toUpperCase() + msgCommand.slice(1);

        if (msgCommand.includes('ostatni dzien')) {
            dateWhereClause = '> CURRENT_DATE - 1';
        } else if (msgCommand.includes('ostatni tydzien')) {
            dateWhereClause = '> CURRENT_DATE - 7';
        } else if (msgCommand.includes('ostatni miesiac')) {
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

        scores = await db.getScoresByPeriod(dateWhereClause);
    }

    return new ResultsCardView(headerTitle, scores).getJson();
};

const handleGetMostShoots = async (msgCommand) => {
    try {
        const headerTitle = msgCommand.charAt(0).toUpperCase() + msgCommand.slice(1);
        let scores;

        if (msgCommand === 'najwiecej rzutow') {
            scores = await db.getMostShootsByPlayer();
            return new MostShootsByPlayerCardView(headerTitle, scores).getJson();
        } else {
            const periodType = util.getPeriodType(msgCommand);
            scores = await db.getMostShootsByPeriod(periodType);
            return new MostShootsByPeriodCardView(headerTitle, scores, periodType).getJson();
        }
    } catch (e) {
        throw e;
    }
};

const handleGetMostWins = async (msgCommand) => {
    try {
        const headerTitle = msgCommand.charAt(0).toUpperCase() + msgCommand.slice(1);
        let scores;

        if (msgCommand === 'najwiecej wygranych') {
            scores = await db.getMostWinsByPlayer();
            return new MostWinsByPlayerCardView(headerTitle, scores).getJson();
        } else {
            const periodType = util.getPeriodType(msgCommand);
            scores = await db.getMostWinsByPeriod(periodType);
            return new MostWinsByPeriodCardView(headerTitle, scores, periodType).getJson();
        }
    } catch (e) {
        throw e;
    }
};

const handleGetMostWinsSeries = async (msgCommand) => {
    try {
        const headerTitle = msgCommand.charAt(0).toUpperCase() + msgCommand.slice(1);
        const mostWinsSeries = await db.getMostWinsSeries();

        return new MostWinsSeriesCardView(headerTitle, mostWinsSeries).getJson();
    } catch (e) {
        throw e;
    }
};

const handleGetMostLostSeries = async (msgCommand) => {
    try {
        const headerTitle = msgCommand.charAt(0).toUpperCase() + msgCommand.slice(1);
        const mostLostSeries = await db.getMostLostSeries();

        return new MostLostSeriesCardView(headerTitle, mostLostSeries).getJson();
    } catch (e) {
        throw e;
    }
};

const handleAddPlayer = async (msgBody) => {
    try {
        const playerChunks = msgBody.split(' ');

        if (playerChunks.length !== 3) {
            throw new ValidationError('Musisz podać imię, nazwisko oraz pseudonim!\nNa przykład: \`dodaj zawodnika Jan Kowalski kendokoluszki\`');
        }

        await db.createPlayer(playerChunks[0], playerChunks[1], playerChunks[2]);

        return new TextView(`Dodano nowego ludzika - *${playerChunks[0]} '${playerChunks[2]}' ${playerChunks[1]}*`).getJson();
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

        const headerTitle = 'Wyniki ostatniego konkursu';
        return new ResultsCardView(headerTitle, playerScores).getJson();
    } catch (e) {
        console.log('ERROR handleAddResults: ' + e);
        throw e;
    }
};

const handleHelpCommand = () => {
    const helpMessage = `Dostępne komendy:
        \`\`\`
        - wyniki
        -- wyniki - ostatni dzień
        -- wyniki - ostatni tydzień
        -- wyniki - ostatni miesiąc
        -- wyniki - ostatni rok
        -- wyniki - od YYYY-MM-DD do YYYY-MM-DD
        - najwięcej rzutów
        -- najwięcej rzutów - miesiąc
        -- najwięcej rzutów - rok
        - najwięcej wygranych
        -- najwięcej wygranych - miesiąc
        -- najwięcej wygranych - rok
        - seria wygranych
        - seria przegranych
        \`\`\`
    `;

    return new TextView(helpMessage).getJson();
};