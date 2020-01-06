require('string.prototype.format');
const ValidationError = require('./ValidationError');
const labels = require('./labels');

const commands = {
    RESULTS: {
        command: 'wyniki',
        cardName: 'Wyniki z ostatniego turnieju',
        buttonName: 'Ostatni turniej'
    },
    RESULTS_LAST_DAY: {
        command: 'wyniki - ostatni dzien',
        cardName: 'Wyniki z ostatniego dnia (wg średniej)',
        buttonName: 'Ostatni dzień'
    },
    RESULTS_LAST_WEEK: {
        command: 'wyniki - ostatni tydzien',
        cardName: 'Wyniki z ostatniego tygodnia (wg średniej)',
        buttonName: 'Ostatni tydzień'
    },
    RESULTS_LAST_MONTH: {
        command: 'wyniki - ostatni miesiac',
        cardName: 'Wyniki z ostatniego miesiąca (wg średniej)',
        buttonName: 'Ostatni miesiąc'
    },
    RESULTS_LAST_YEAR: {
        command: 'wyniki - ostatni rok',
        cardName: 'Wyniki z ostatniego roku (wg średniej)',
        buttonName: 'Ostatni rok'
    },
    MOST_SHOOTS: {
        command: 'najwiecej rzutow',
        cardName: 'Najwięcej rzutów',
        buttonName: 'Ogólnie'
    },
    MOST_SHOOTS_MONTHLY: {
        command: 'najwiecej rzutow - miesiac',
        cardName: 'Najwięcej rzutów - miesięcznie',
        buttonName: 'Miesięcznie'
    },
    MOST_SHOOTS_YEARLY: {
        command: 'najwiecej rzutow - rok',
        cardName: 'Najwięcej rzutów - rocznie',
        buttonName: 'Rocznie'
    },
    MOST_WINS: {
        command: 'najwiecej wygranych',
        cardName: 'Najwięcej wygranych',
        buttonName: 'Ogólnie'
    },
    MOST_WINS_MONTHLY: {
        command: 'najwiecej wygranych - miesiac',
        cardName: 'Najwięcej wygranych - miesięcznie',
        buttonName: 'Miesięcznie'
    },
    MOST_WINS_YEARLY: {
        command: 'najwiecej wygranych - rok',
        cardName: 'Najwięcej wygranych - rocznie',
        buttonName: 'Rocznie'
    },
    SERIES_WINS: {
        command: 'seria wygranych',
        cardName: 'Najdłuższa seria wygranych',
        buttonName: 'Najdłuższa seria wygranych'
    },
    SERIES_LOST: {
        command: 'seria przegranych',
        cardName: 'Najdłuższa seria przegranych',
        buttonName: 'Najdłuższa seria przegranych'
    },
    HELP: {
        command: 'pomoc',
        cardName: 'Pomoc',
        buttonName: 'Pomoc'
    }
};

const getShootsDeclination = (shootsNum) => {
    shootsNum = parseInt(shootsNum);

    if (shootsNum === 1) {
        return labels.SHOOT_ONE.format(shootsNum);
    } else if (2 <= shootsNum && shootsNum <= 4) {
        return labels.SHOOT_FEW.format(shootsNum);
    } else {
        return labels.SHOOT_MANY.format(shootsNum);
    }
};

const getRoundsDeclination = (roundsNum) => {
    roundsNum = parseInt(roundsNum);

    if (roundsNum === 1) {
        return labels.ROUND_ONE.format(roundsNum);
    } else {
        return labels.ROUND_MANY.format(roundsNum);
    }
};

const getTournamentsDeclination = (tournamentsNum) => {
    tournamentsNum = parseInt(tournamentsNum);

    if (tournamentsNum === 1) {
        return labels.TOURNAMENT_ONE.format(tournamentsNum);
    } else {
        return labels.TOURNAMENT_MANY.format(tournamentsNum);
    }
};

const getWinsDeclination = (winsNum) => {
    winsNum = parseInt(winsNum);

    if (winsNum === 1) {
        return labels.TOURNAMENT_WON_ONE.format(winsNum);
    } else if (2 <= winsNum && winsNum <= 4) {
        return labels.TOURNAMENT_WON_FEW.format(winsNum);
    } else {
        return labels.TOURNAMENT_WON_MANY.format(winsNum);
    }
};

const getLostDeclination = (lostNum) => {
    lostNum = parseInt(lostNum);

    if (lostNum === 1) {
        return labels.TOURNAMENT_LOST_ONE.format(lostNum);
    } else if (2 <= lostNum && lostNum <= 4) {
        return labels.TOURNAMENT_LOST_FEW.format(lostNum);
    } else {
        return labels.TOURNAMENT_LOST_MANY.format(lostNum);
    }
};

const getPlace = (placeNum) => {
    placeNum = parseInt(placeNum);

    let text = labels.NTH_PLACE.format(placeNum);
    if (placeNum === 1) {
        text += labels.WINNER_APPENDIX;
    }

    return text;
};

const getPeriodType = (msg) => {
    if (msg.includes('miesiac')) {
        return 'month';
    } else if (msg.includes('rok')) {
        return 'year';
    }

    throw new ValidationError(labels.NO_SUCH_PERIOD);
};

const getPlaceIconUrl = (placeNum) => {
    const url = 'https://ssl.gstatic.com/dynamite/emoji/png/128/';
    placeNum = parseInt(placeNum);

    switch (placeNum) {
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

const handleSeriesData = (data, eventName) => {
    let tempAliasToEventsNum = {};
    let prevAlias;

    return Object.entries(data.rows
        .reduce((aliasToEventsNum, row) => {
            if (row.alias === prevAlias) {
                tempAliasToEventsNum[row.alias]++;

                if (!aliasToEventsNum.hasOwnProperty(row.alias) || tempAliasToEventsNum[row.alias] > aliasToEventsNum[row.alias]) {
                    aliasToEventsNum[row.alias] = tempAliasToEventsNum[row.alias];
                }
            } else {
                tempAliasToEventsNum[row.alias] = 1;
            }

            prevAlias = row.alias;

            return aliasToEventsNum;
        }, {}))
        .map(elem => { return { alias: elem[0], [eventName]: elem[1] }})
        .sort((a, b) => b[eventName] - a[eventName]);
};

module.exports = {
    commands,
    getShootsDeclination,
    getRoundsDeclination,
    getTournamentsDeclination,
    getWinsDeclination,
    getLostDeclination,
    getPlace,
    getPeriodType,
    getPlaceIconUrl,
    handleSeriesData
};