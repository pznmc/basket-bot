require('string.prototype.format');
const commands = require('../commands');
const labels = require('../labels');

const TextView = require('../views/TextView');

exports.response = async (message) => {
    try {
        console.log(JSON.stringify(message));
        const { argumentText, sender, space } = message || {};
        const senderEmail = sender && sender.email;
        const spaceType = space && space.type;

        // Get command when text is multiline or not
        let messageCommand = argumentText.includes('\n') ? argumentText.trim().substring(0, argumentText.indexOf('\n')).trim() : argumentText.trim();

        // Remove diacritic characters & change it to lowercase
        messageCommand = messageCommand.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0142/g, 'l');

        // Get message body only when entire text is multiline
        const messageBody = argumentText.includes('\n') ? argumentText.substring(argumentText.indexOf('\n')).trim() : '';
        console.log('COMM: ' + messageCommand);
        console.log('BODY: ' + messageBody);

        const commandEntry = Object.values(commands).find(commandEntry => commandEntry.commandRegex.test(messageCommand));
        console.log('COMMAND ENTRY: ' + JSON.stringify(commandEntry));

        if (commandEntry) {
            return await new commandEntry.controller(commandEntry, messageCommand, messageBody)
                .validateSpaceType(spaceType)
                .addSender(sender)
                .addCommands(commands)
                .getResults();
        } else {
            return new TextView(labels.NO_COMMAND).getJson();
        }
    } catch (e) {
        throw e;
    }
};
