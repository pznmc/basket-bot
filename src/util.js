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
        return `${winsNum} wygrana`;
    } else if (2 <= winsNum && winsNum <= 4) {
        return `${winsNum} wygrane`;
    } else {
        return `${winsNum} wygranych`;
    }
};

const getPeriodType = (msg) => {
    if (msg.includes('miesiąc') || msg.includes('miesiac')) {
        return 'month';
    } else if (msg.includes('rok')) {
        return 'year';
    }

    throw new ValidationError('Nie ma takiego okresu!');
};

module.exports = {
    getShootsDeclination,
    getRoundsDeclination,
    getTournamentsDeclination,
    getWinsDeclination,
    getPeriodType
};