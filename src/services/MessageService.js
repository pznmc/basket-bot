const db = require('../db');
const ValidationError = require('../ValidationError');

exports.response = async (message) => {
    try {
        const {sender, argumentText} = message || {};

        const messageCommand = argumentText.includes('/n') ? argumentText.trim().substring(0, argumentText.indexOf('\n') - 1) : argumentText.trim();
        const messageBody = argumentText.includes('/n') ? argumentText.trim().substring(argumentText.indexOf('\n')) : '';
        console.log('COMM: ' + messageCommand);
        console.log('BODY: ' + messageBody);

        if (messageCommand === 'dodaj wyniki') {
            const playerScores = {
                cardTitle: 'Wyniki ostatniego turnieju',
                data: await handleAddResults(messageBody)
            };
            return renderResultsCard(playerScores);
        } else if (messageCommand === 'dodaj zawodnika') {
            return renderText(await handleAddPlayer(messageBody));
        } else if (messageCommand.startsWith('wyniki')) {
            const scores = await handleGetResults(messageCommand);
            return renderResultsCard(scores);
        }

        return renderText('Brak takiej komendy, spróbuj coś innego...');
    } catch (e) {
        console.log('ERROR response: ' + e);
        throw e;
    }
};

const handleGetResults = async (msgCommand) => {
    let dateWhereClause = '';

    if (msgCommand === 'wyniki') {
        dateWhereClause = 'CURRENT_DATE - 0';
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
            dateWhereClause = 'BETWEEN \'2019-11-01\' AND \'2019-12-01\'';
        }
    }

    const scores = {
        cardTitle: msgCommand.charAt(0).toUpperCase() + msgCommand.slice(1),
        data: await db.getScores(dateWhereClause)
    };

    return scores;
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

const renderResultsSection = (playerScores) => {
    let resultsSection = {};
    resultsSection.widgets = playerScores.map(renderResultsPlace);

    return resultsSection;
};

const renderButtonsSection = () => {
    let buttonsSection = {};
    buttonsSection.widgets = [];

    let buttons = [];
    buttons.push(renderTextButton('Ostatni dzień', 'getResults', 'daily'));
    buttons.push(renderTextButton('Ostatni tydzień', 'getResults', 'weekly'));
    buttons.push(renderTextButton('Ostatni miesiąc', 'getResults', 'monthly'));
    buttonsSection.widgets.push({
        'buttons': buttons
    });

    return buttonsSection;
};

const renderTextButton = (buttonName, actionMethodName, actionType) => {
    let button = {};
    button.textButton = {};
    button.textButton.text = buttonName;
    button.textButton.onClick = {};
    button.textButton.onClick.action = {};
    button.textButton.onClick.action.actionMethodName = actionMethodName;
    button.textButton.onClick.action.parameters = [
        {
            "key": "period",
            "value": actionType
        }
    ];

    return button;
};

const renderCardHeader = (title) => {
    return {title};
};

const renderResultsPlace = (playerScoreData) => {
    const { alias, place, shoots, playoffShoots, playoffRounds } = playerScoreData;

    return {
        'keyValue': {
            'iconUrl': getPlaceIconUrl(place),
            'topLabel': generateTopLabel(place),
            'content': alias,
            'bottomLabel': generateBottomLabel(shoots, playoffShoots, playoffRounds)
        }
    }
};

const getPlaceIconUrl = (place) => {
    let url = 'https://ssl.gstatic.com/dynamite/emoji/png/128/';

    switch (place) {
        case 1:
            return url + 'emoji_u1f947.png';
        case 2:
            return url + 'emoji_u1f948.png';
        case 3:
            return url + 'emoji_u1f949.png';
        default:
            return url + 'emoji_u1f636.png';
    }
};

const generateTopLabel = (place) => {
    let text = `${place} miejsce`;
    if (place === 1) {
        text += ' - Zwycięzca';
    }

    return text;
};

const generateBottomLabel = (shootsNum, playoffShoots, playoffRounds) => {
    let bottomLabel = generateThrowsString(shootsNum);

    if (playoffRounds > 0) {
        bottomLabel += ` (dogrywka: ${generateThrowsString(playoffShoots)} w ${generateRoundsString(playoffRounds)})`;
    }

    return bottomLabel;
};

const generateThrowsString = (shootsNum) => {
    if (shootsNum === 1) {
        return `${shootsNum} rzut`;
    } else if (2 <= shootsNum && shootsNum <= 4) {
        return `${shootsNum} rzuty`;
    } else {
        return `${shootsNum} rzutów`;
    }
};

const generateRoundsString = (roundsNum) => {
    if (roundsNum === 1) {
        return `${roundsNum} rundzie`;
    } else {
        return `${roundsNum} rundach`;
    }
};