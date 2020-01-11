const TextView = require('./TextView');

module.exports = class LastTenTournamentsByPlayerView {
    constructor(score) {
        this.score = score;
        this.handleData();
    }

    handleData() {
        const { shoots, avg_shoots, max_shoots, min_shoots, wins, loses } = this.score;

        let msg = 'Rzutow: ' + shoots;
        msg += '\nŚrednio: ' + avg_shoots;
        msg += '\nNajwięcej rzutów: ' + max_shoots;
        msg += '\nNajmniej rzutów: ' + min_shoots;
        msg += '\nWygranych: ' + wins;
        msg += '\nPrzegranych: ' + loses;

        return new TextView(msg);
    };
};