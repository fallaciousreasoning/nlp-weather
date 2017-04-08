const moment = require('moment');

const forecastConfig = require('./forecast.io-config');
const Forecast = require('./forecast.io');
const forecastClient = new Forecast(forecastConfig.token);

require('./location-parser');

let natural = require('natural');
natural.LancasterStemmer.attach();

let testSentences = [
    "What's the weather like today?",
   "How's the weather?",
    "What's the weather tomorrow?",
    "Weather tomorrow?",
    "Weather next friday?",
    "What's the weather on Thursday?",
   "The fox doesn't know whether to jump the lazy dog"
];

let triggers = [
    "Weather",
];
triggers = triggers.map(trigger => trigger.tokenizeAndStem());

let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

let dates = [
    "Today",
    "Tomorrow"
];

dates = dates.concat(daysOfWeek);

daysOfWeek.map(doW => doW.tokenizeAndStem());
dates = dates.map(date => date.tokenizeAndStem());

class Weather {
    constructor(query, date) {
        this.query = query;
        this.date = date;
    }
}

const containsTokens = (tokens, sentenceTokens) => {
    for (var i = 0; i < tokens.length; ++i) {
        if (sentenceTokens.indexOf(tokens[i]) === -1) return false;
    }

    return true;
}

const humanDayToOffset = (humanDay) => {
    // TODO the stemming operation will do trippy stuff to some words so this
    // is maybe not the best idea... 
    // (these ones are fine but in general this isn't)
    switch (humanDay) {
        case "today":
            return 0;
        case "tomorrow":
            return 1;
        default:
            return (daysOfWeek.indexOf(humanDay) + new Date().getDay()) % 7;
    }
}

const evaluateSentence = (sentence) => {
    let tokenized = sentence.tokenizeAndStem();

    if (!triggers.find(trigger => containsTokens(trigger, tokenized))) return false;

    let humanDay = dates.find(day => containsTokens(day, tokenized)) || dates[0];

    // TODO this is also dodgy, we could potentially have multi token days, I guess.
    let dayOffset = humanDayToOffset(humanDay[0]);

    let date = moment().add(dayOffset, 'days');

    return new Weather(sentence, date._d);
}

testSentences.forEach(sentence => {
    console.log(evaluateSentence(sentence));
});

forecastClient.forecast(-43.5321,172.6362)
    .then(console.log);