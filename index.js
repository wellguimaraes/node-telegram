#!/usr/bin/env node

var request = require('request-promise');
var availableArgs = {
    '-t': 'token',
    '-c': 'chatId',
    '-m': 'message'
};

function getArguments() {
    var args = process.argv.slice(2);
    var argsMap = {};

    for (var i = 0, len = args.length; i < len; i += 2) {
        if (args[i] == '-h' || args[i] == '--help')
            argsMap['help'] = true;
        else {
            var argType = availableArgs[args[i]];

            if (!argType || i + 1 >= len)
                throw new Error('Invalid argument: ' + args[i]);

            argsMap[argType] = args[i + 1];
        }
    }

    if (!argsMap.help && !argsMap.token)
        console.error('You must specify the BOT TOKEN using -t');

    if (!argsMap.help && !argsMap.chatId)
        console.error('You must specify the CHAT ID using -c');

    if (!argsMap.help && !argsMap.message)
        console.error('You must specify the MESSAGE using -m');

    return argsMap;
}

var args = getArguments();

if (args.help || Object.keys(args).length != 3)
    console.log('\nUsage: node-telegram -t \'bot_token\' -c \'chat_id\' -m \'message_to_send\'');
else
    request({
        uri: `https://api.telegram.org/bot${args.token}/sendMessage`,
        method: 'POST',
        body: {
            "chat_id": args.chatId,
            "text": args.message
        },
        json: true
    })
        .then(function (response) {
            if (response.ok == true)
                console.log('done');
            else
                console.error('error');
        })
        .catch(function () {
            console.error('error');
        });

