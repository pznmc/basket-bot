const AddResultsController = require('./controllers/AddResultsController');
const AddPlayerController = require('./controllers/AddPlayerController');
const ResultsController = require('./controllers/ResultsController');
const MostShootsController = require('./controllers/MostShootsController');
const MostWinsController = require('./controllers/MostWinsController');
const MostLosesController = require('./controllers/MostLosesController');
const MostWinsSeriesController = require('./controllers/MostWinsSeriesController');
const MostLosesSeriesController = require('./controllers/MostLosesSeriesController');
const HelpController = require('./controllers/HelpController');
const BestTournamentsController = require('./controllers/BestTournamentsController');
const WorstTournamentsController = require('./controllers/WorstTournamentsController');
const LastTenTournamentsController = require('./controllers/LastTenTournamentsController');

module.exports = {
    ADD_RESULTS: {
        command: 'dodaj wyniki',
        commandRegex: /^dodaj wyniki$/,
        controller: AddResultsController
    },
    JOIN_TO_GAME: {
        command: 'dolacz',
        commandRegex: /\b(dolacz)\b/,
        spaceTypes: ['ROOM'],
        controller: AddPlayerController
    },
    RESULTS: {
        command: 'wyniki',
        commandRegex: /^\bwyniki\b/,
        cardName: 'Wyniki z ostatniego turnieju',
        buttonName: 'Ostatni turniej',
        controller: ResultsController,
        subCommands: {
            LAST_DAY: {
                command: 'ostatni dzien',
                commandRegex: /\bostatni dzien\b$/,
                cardName: 'Wyniki z ostatniego dnia (wg średniej)',
                buttonName: 'Ostatni dzień'
            },
            LAST_WEEK: {
                command: 'ostatni tydzien',
                commandRegex: /\bostatni tydzien\b$/,
                cardName: 'Wyniki z ostatniego tygodnia (wg średniej)',
                buttonName: 'Ostatni tydzień'
            },
            LAST_MONTH: {
                command: 'ostatni miesiac',
                commandRegex: /\bostatni miesiac\b$/,
                cardName: 'Wyniki z ostatniego miesiąca (wg średniej)',
                buttonName: 'Ostatni miesiąc'
            },
            LAST_YEAR: {
                command: 'ostatni rok',
                commandRegex: /\bostatni rok\b$/,
                cardName: 'Wyniki z ostatniego roku (wg średniej)',
                buttonName: 'Ostatni rok'
            }
        }
    },
    MOST_SHOOTS: {
        command: 'najwiecej rzutow',
        commandRegex: /^\b(najwiecej rzutow)\b/,
        cardName: 'Najwięcej rzutów',
        buttonName: 'Ogólnie',
        controller: MostShootsController,
        subCommands: {
            MONTHLY: {
                command: 'miesiac',
                commandRegex: /\bmiesiac\b$/,
                cardName: 'Najwięcej rzutów - miesięcznie',
                buttonName: 'Miesięcznie'
            },
            YEARLY: {
                command: 'rok',
                commandRegex: /\brok\b$/,
                cardName: 'Najwięcej rzutów - rocznie',
                buttonName: 'Rocznie'
            }
        }
    },
    MOST_WINS: {
        command: 'najwiecej wygranych',
        commandRegex: /^\b(najwiecej wygranych)\b/,
        cardName: 'Najwięcej wygranych',
        buttonName: 'Ogólnie',
        controller: MostWinsController,
        subCommands: {
            MONTHLY: {
                command: 'miesiac',
                commandRegex: /\bmiesiac\b$/,
                cardName: 'Najwięcej wygranych - miesięcznie',
                buttonName: 'Miesięcznie'
            },
            YEARLY: {
                command: 'rok',
                commandRegex: /\brok\b$/,
                cardName: 'Najwięcej wygranych - rocznie',
                buttonName: 'Rocznie'
            }
        },
    },
    MOST_LOSES: {
        command: 'najwiecej przegranych',
        commandRegex: /^\b(najwiecej przegranych)\b/,
        cardName: 'Najwięcej przegranych',
        buttonName: 'Ogólnie',
        controller: MostLosesController,
        subCommands: {
            MONTHLY: {
                command: 'miesiac',
                commandRegex: /\bmiesiac\b$/,
                cardName: 'Najwięcej przegranych - miesiąc',
                buttonName: 'Miesięcznie'
            },
            YEARLY: {
                command: 'rok',
                commandRegex: /\brok\b$/,
                cardName: 'Najwięcej przegranych - rok',
                buttonName: 'Rocznie'
            }
        }
    },
    SERIES_WINS: {
        command: 'seria wygranych',
        commandRegex: /\b(seria wygranych)\b/,
        cardName: 'Najdłuższa seria wygranych',
        buttonName: 'Najdłuższa seria wygranych',
        controller: MostWinsSeriesController
    },
    SERIES_LOST: {
        command: 'seria przegranych',
        commandRegex: /\b(seria przegranych)\b/,
        cardName: 'Najdłuższa seria przegranych',
        buttonName: 'Najdłuższa seria przegranych',
        controller: MostLosesSeriesController
    },
    BEST_TOURNAMENTS: {
        command: 'najlepsze turnieje',
        commandRegex: /\b(najlepsze turnieje)\b/,
        cardName: 'Turnieje z największą średnią rzutów',
        buttonName: 'Najlepsze turnieje',
        controller: BestTournamentsController
    },
    WORST_TOURNAMENTS: {
        command: 'najgorsze turnieje',
        commandRegex: /\b(najgorsze turnieje)\b/,
        cardName: 'Turnieje z najmniejszą średnią rzutów',
        buttonName: 'Najgorsze turnieje',
        controller: WorstTournamentsController
    },
    LAST_TEN_TOURNAMENTS: {
        command: 'ostatnie 10 turniejow',
        commandRegex: /\b(ostatnie 10 turniejow)\b/,
        cardName: 'Ostatnie 10 turniejów',
        controller: LastTenTournamentsController
    },
    HELP: {
        command: 'pomoc',
        commandRegex: /\b(pomoc)\b/,
        cardName: 'Pomoc',
        buttonName: 'Pomoc',
        controller: HelpController
    }
};