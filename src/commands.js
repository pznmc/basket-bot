const AddResultsController = require('./controllers/AddResultsController');
const AddPlayerController = require('./controllers/AddPlayerController');
const ResultsController = require('./controllers/ResultsController');
const MostShootsController = require('./controllers/MostShootsController');
const MostWinsController = require('./controllers/MostWinsController');
const MostLosesController = require('./controllers/MostLosesController');
const MostWinsSeriesController = require('./controllers/MostWinsSeriesController');
const MostLosesSeriesController = require('./controllers/MostLosesSeriesController');
const HelpController = require('./controllers/HelpController');
const TournamentsController = require('./controllers/TournamentsController');
const LastTenTournamentsController = require('./controllers/LastTenTournamentsController');

module.exports = {
    ADD_RESULTS: {
        command: 'dodaj wyniki',
        controller: AddResultsController
    },
    JOIN_TO_GAME: {
        command: 'dolacz',
        controller: AddPlayerController
    },
    RESULTS: {
        command: 'wyniki',
        cardName: 'Wyniki z ostatniego turnieju',
        buttonName: 'Ostatni turniej',
        controller: ResultsController,
        subCommands: {
            LAST_DAY: {
                command: 'ostatni dzien',
                cardName: 'Wyniki z ostatniego dnia (wg średniej)',
                buttonName: 'Ostatni dzień'
            },
            LAST_WEEK: {
                command: 'ostatni tydzien',
                cardName: 'Wyniki z ostatniego tygodnia (wg średniej)',
                buttonName: 'Ostatni tydzień'
            },
            LAST_MONTH: {
                command: 'ostatni miesiac',
                cardName: 'Wyniki z ostatniego miesiąca (wg średniej)',
                buttonName: 'Ostatni miesiąc'
            },
            LAST_YEAR: {
                command: 'ostatni rok',
                cardName: 'Wyniki z ostatniego roku (wg średniej)',
                buttonName: 'Ostatni rok'
            }
        }
    },
    MOST_SHOOTS: {
        command: 'najwiecej rzutow',
        cardName: 'Najwięcej rzutów',
        buttonName: 'Ogólnie',
        controller: MostShootsController,
        subCommands: {
            MONTHLY: {
                command: 'miesiac',
                cardName: 'Najwięcej rzutów - miesięcznie',
                buttonName: 'Miesięcznie'
            },
            YEARLY: {
                command: 'rok',
                cardName: 'Najwięcej rzutów - rocznie',
                buttonName: 'Rocznie'
            }
        }
    },
    MOST_WINS: {
        command: 'najwiecej wygranych',
        cardName: 'Najwięcej wygranych',
        buttonName: 'Ogólnie',
        controller: MostWinsController,
        subCommands: {
            MONTHLY: {
                command: 'miesiac',
                cardName: 'Najwięcej wygranych - miesięcznie',
                buttonName: 'Miesięcznie'
            },
            YEARLY: {
                command: 'rok',
                cardName: 'Najwięcej wygranych - rocznie',
                buttonName: 'Rocznie'
            }
        },
    },
    MOST_LOSES: {
        command: 'najwiecej przegranych',
        cardName: 'Najwięcej przegranych',
        buttonName: 'Ogólnie',
        controller: MostLosesController,
        subCommands: {
            MONTHLY: {
                command: 'miesiac',
                cardName: 'Najwięcej przegranych - miesiąc',
                buttonName: 'Miesięcznie'
            },
            YEARLY: {
                command: 'rok',
                cardName: 'Najwięcej przegranych - rok',
                buttonName: 'Rocznie'
            }
        }
    },
    SERIES_WINS: {
        command: 'seria wygranych',
        cardName: 'Najdłuższa seria wygranych',
        buttonName: 'Najdłuższa seria wygranych',
        controller: MostWinsSeriesController
    },
    SERIES_LOST: {
        command: 'seria przegranych',
        cardName: 'Najdłuższa seria przegranych',
        buttonName: 'Najdłuższa seria przegranych',
        controller: MostLosesSeriesController
    },
    BEST_TOURNAMENTS: {
        command: 'najlepsze turnieje',
        cardName: 'Turnieje z największą średnią rzutów',
        buttonName: 'Najlepsze turnieje',
        controller: TournamentsController
    },
    WORST_TOURNAMENTS: {
        command: 'najgorsze turnieje',
        cardName: 'Turnieje z najmniejszą średnią rzutów',
        buttonName: 'Najgorsze turnieje',
        controller: TournamentsController
    },
    LAST_TEN_TOURNAMENTS: {
        command: 'ostatnie 10 turniejow',
        cardName: 'Ostatnie 10 turniejów',
        controller: LastTenTournamentsController
    },
    HELP: {
        command: 'pomoc',
        cardName: 'Pomoc',
        buttonName: 'Pomoc',
        controller: HelpController
    }
};