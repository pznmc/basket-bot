const ValidationError = require('./ValidationError');

const getShootsDeclination = (shootsNum) => {
    if (shootsNum === 1) {
        return `${shootsNum} rzut`;
    } else if (2 <= shootsNum && shootsNum <= 4) {
        return `${shootsNum} rzuty`;
    } else {
        return `${shootsNum} rzutów`;
    }
};

const getRoundsDeclination = (roundsNum) => {
    if (roundsNum === 1) {
        return `${roundsNum} rundzie`;
    } else {
        return `${roundsNum} rundach`;
    }
};

const getTournamentsDeclination = (tournamentsNum) => {
    if (tournamentsNum === 1) {
        return `${tournamentsNum} turnieju`;
    } else {
        return `${tournamentsNum} turniejach`;
    }
};

const getWinsDeclination = (winsNum) => {
    if (winsNum === 1) {
        return `${winsNum} turniej wygrany`;
    } else if (2 <= winsNum && winsNum <= 4) {
        return `${winsNum} turnieje wygrane`;
    } else {
        return `${winsNum} turniejów wygranych`;
    }
};

const getLostDeclination = (lostNum) => {
    if (lostNum === 1) {
        return `${lostNum} turniej przegrany`;
    } else if (2 <= lostNum && lostNum <= 4) {
        return `${lostNum} turnieje przegrane`;
    } else {
        return `${lostNum} turniejów przegranych`;
    }
};

const getPlace = (placeNum) => {
    let text = `${placeNum} miejsce`;
    if (placeNum === 1) {
        text += ' - Zwycięzca';
    }

    return text;
};

const getPeriodType = (msg) => {
    if (msg.includes('miesiac')) {
        return 'month';
    } else if (msg.includes('rok')) {
        return 'year';
    }

    throw new ValidationError('Nie ma takiego okresu!');
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

module.exports = {
    getShootsDeclination,
    getRoundsDeclination,
    getTournamentsDeclination,
    getWinsDeclination,
    getLostDeclination,
    getPlace,
    getPeriodType,
    getPlaceIconUrl
};