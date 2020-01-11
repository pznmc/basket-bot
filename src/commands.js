module.exports = {
    ADD_RESULTS: {
        command: 'dodaj wyniki'
    },
    ADD_PLAYER: {
        command: 'dodaj zawodnika'
    },
    RESULTS: {
        command: 'wyniki',
            cardName: 'Wyniki z ostatniego turnieju',
            buttonName: 'Ostatni turniej',
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
        buttonName: 'Najdłuższa seria wygranych'
    },
    SERIES_LOST: {
        command: 'seria przegranych',
        cardName: 'Najdłuższa seria przegranych',
        buttonName: 'Najdłuższa seria przegranych'
    },
    BEST_TOURNAMENTS: {
        command: 'najlepsze turnieje',
        cardName: 'Turnieje z największą średnią rzutów',
        buttonName: 'Najlepsze turnieje'
    },
    WORST_TOURNAMENTS: {
        command: 'najgorsze turnieje',
        cardName: 'Turnieje z najmniejszą średnią rzutów',
        buttonName: 'Najgorsze turnieje'
    },
    HELP: {
        command: 'pomoc',
        cardName: 'Pomoc',
        buttonName: 'Pomoc'
    }
};