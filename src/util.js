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

module.exports = {
    getShootsDeclination,
    getRoundsDeclination,
    getTournamentsDeclination
};