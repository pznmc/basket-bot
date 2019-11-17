const express = require('express');
const PORT = process.env.PORT || 8888;

const playerScores = [
    {
        'place': 1,
        'alias': 'Radek',
        'shoots': 7
    },
    {
        'place': 2,
        'alias': 'Fifonż',
        'shoots': 5
    },
    {
        'place': 3,
        'alias': 'Tomek',
        'shoots': 4
    },
    {
        'place': 4,
        'alias': 'Kuba',
        'shoots': 1
    }
];

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.post('/', (req, res) => {
    console.log(JSON.stringify(req.body));
    const { space, user, type, message, action } = req.body || {};

    switch (type) {
        case 'ADDED_TO_SPACE':
            let text = '';

            if (space.type === 'ROOM') {
                text = `Thanks for adding me to ${space.displayName}`;
            } else if (space.type === 'DM') {
                text = `Thanks for adding me to ${user.displayName}`;
            }

            return res.json({text});
        case 'MESSAGE':
            return res.json(renderResultsCard('Wyniki', playerScores));
            // return res.json({text: `You have wrote: ${message.text}`});
        case 'CARD_CLICKED':
            return res.json({text: `You wanted to make an action ${action.actionMethodName} with parameters: ${action.parameters}`});
        default:
            return res.json({text: 'Unknown type'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running in port - ${PORT}`);
});

const renderResultsCard = (title, playerScores) => {
    let response = {};
    response.cards = [];

    const card = {};
    card.header = renderCardHeader(title);
    card.sections = [
        renderResultsSection(playerScores),
        renderButtonsSection()
    ];

    return card;
};

const renderResultsSection = (playerScores) => {
    let resultsSection = {};
    resultsSection.widgets = playerScores.map(renderResultsPlace);

    return resultsSection;
};

const renderButtonsSection = () => {
    let buttonsSection = {};
    buttonsSection.widgets = [];
    buttonsSection.widgets.push(renderTextButton('Dzienne', 'getResults', 'daily'));
    buttonsSection.widgets.push(renderTextButton('Tygodniowe', 'getResults', 'weekly'));
    buttonsSection.widgets.push(renderTextButton('Miesięczne', 'getResults', 'monthly'));

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
            return url + '';
        case 3:
            return url + '';
        default:
            return url + '';
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