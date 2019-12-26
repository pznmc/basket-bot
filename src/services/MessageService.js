const db = require('../db');

exports.response = (message) => {
    const { sender, argumentText } = message || {};

    const messageCommand = argumentText.trim().substring(0, argumentText.indexOf('\n') - 1);
    const messageBody = argumentText.trim().substring(argumentText.indexOf('\n'));
    console.log('COMM: ' + messageCommand);
    console.log('BODY: ' + messageBody);

    if (messageCommand === 'dodaj wyniki') {
        return renderResultsCard('Wyniki', handleAddResults(messageBody));
    } else if (messageCommand === 'dodaj zawodnika') {
        return renderText(handleAddPlayer(messageBody));
    }

    return renderText('Brak takiej komendy, spróbuj coś innego...');
};

const handleAddPlayer = (msgBody) => {
    const playerChunks = msgBody.split(' ');

    if (playerChunks.length !== 3) {
        throw new Error('Musisz podać imię, nazwisko oraz pseudonim!\nNa przykład: dodaj zawodnika Jan Kowalski kendokoluszki');
    }

    db.createPlayer(playerChunks[0], playerChunks[1], playerChunks[2])
        .then(() => {
            return `Dodano nowego ludzika - *${playerChunks[0]} '${playerChunks[2]}' ${playerChunks[1]}*`;
        })
        .catch(e => {
            throw e;
        });
};

const handleAddResults = (msgBody) => {
    const results = msgBody.split('\n').map(result => result.split('. ').pop());

    const playerScores = results.map((result, index) => {
        const resultChunks = result.split(' - ');
        return {
            'place': ++index,
            'alias': resultChunks[0],
            'shoots': resultChunks[1].split(' + ').shift()
        }
    });

    db.createScores(playerScores)
        .then(() => {
            return playerScores;
        })
        .catch(e => {
            console.log('PAZNA ERROR - handleAddResults: ' + e);
            //throw e;
            return playerScores;
        });
};

const renderText = (msg) => {
    return {
        'text': msg
    };
};

const renderResultsCard = (title, playerScores) => {
    let response = {};
    response.cards = [];

    const card = {};
    card.header = renderCardHeader(title);
    card.sections = [
        renderResultsSection(playerScores),
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
    buttons.push(renderTextButton('Dzienne', 'getResults', 'daily'));
    buttons.push(renderTextButton('Tygodniowe', 'getResults', 'weekly'));
    buttons.push(renderTextButton('Miesięczne', 'getResults', 'monthly'));
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
    const { alias, place, shoots } = playerScoreData;

    return {
        'keyValue': {
            'iconUrl': getPlaceIconUrl(place),
            'topLabel': generateTopLabel(place),
            'content': alias,
            'bottomLabel': generateBottomLabel(shoots)
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

const generateBottomLabel = (shootsNum) => {
    if (shootsNum === 1) {
        return `${shootsNum} rzut trafiony`;
    } else if (2 <= shootsNum && shootsNum <= 4) {
        return `${shootsNum} rzuty trafione`;
    } else {
        return `${shootsNum} rzutów trafionych`;
    }
};