import { Card } from "./Card";

export class ResultsCard extends Card {
    constructor(title, playerScores) {
        super();

        this.setTitle(title);
        this.handleBodySection(playerScores);
    }

    handleBodySection(playerScores) {
        let bodySection = {};

        bodySection.widgets = playerScores.map(this.handleBodyElement);
        this.addSection(bodySection);
    }

    handleButtonsSection() {
        let buttonsSection = {};
        buttonsSection.widgets = [];

        let buttons = [];
        buttons.push(renderTextButton('Ostatni dzień', 'getResults', 'daily'));
        buttons.push(renderTextButton('Ostatni tydzień', 'getResults', 'weekly'));
        buttons.push(renderTextButton('Ostatni miesiąc', 'getResults', 'monthly'));
        buttonsSection.widgets.push({
            buttons: buttons
        });

        this.addSection(buttonsSection);
    }

    renderTextButton(buttonName, actionMethodName, actionType) {
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

    handleBodyElement(playerScore) {
        const { alias, place, shoots, playoffShoots, playoffRounds, tournamentsNum } = playerScore;

        return {
            keyValue: {
                iconUrl: this.getPlaceIconUrl(place),
                topLabel: this.generateTopLabel(place),
                content: alias,
                bottomLabel: this.generateBottomLabel(shoots, playoffShoots, playoffRounds, tournamentsNum)
            }
        }
    }

    getPlaceIconUrl(placeNum) {
        let url = 'https://ssl.gstatic.com/dynamite/emoji/png/128/';
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
    }

    generateTopLabel = (placeNum) => {
        let text = `${placeNum} miejsce`;
        if (placeNum === 1) {
            text += ' - Zwycięzca';
        }

        return text;
    };

    generateBottomLabel = (shootsNum, playoffShoots, playoffRounds, tournamentsNum) => {
        let bottomLabel = this.generateThrowsString(shootsNum);

        if (playoffRounds > 0) {
            bottomLabel += ` (dogrywka: ${this.generateThrowsString(playoffShoots)} w ${this.generateRoundsString(playoffRounds)})`;
        } else if (tournamentsNum) {
            bottomLabel += ` w ${this.generateTournamentsString(tournamentsNum)}`;
        }

        return bottomLabel;
    };

    generateThrowsString = (shootsNum) => {
        if (shootsNum === 1) {
            return `${shootsNum} rzut`;
        } else if (2 <= shootsNum && shootsNum <= 4) {
            return `${shootsNum} rzuty`;
        } else {
            return `${shootsNum} rzutów`;
        }
    };

    generateRoundsString = (roundsNum) => {
        if (roundsNum === 1) {
            return `${roundsNum} rundzie`;
        } else {
            return `${roundsNum} rundach`;
        }
    };

    generateTournamentsString = (roundsNum) => {
        if (roundsNum === 1) {
            return `${roundsNum} turnieju`;
        } else {
            return `${roundsNum} turniejach`;
        }
    };
}