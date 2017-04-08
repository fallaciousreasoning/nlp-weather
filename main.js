const moment = require('moment');

const forecastConfig = require('./forecast.io-config');
const Forecast = require('./forecast.io');
const forecastClient = new Forecast(forecastConfig.token);

const locationHelper = require('./location-parser');

let natural = require('natural');
natural.LancasterStemmer.attach();

let testSentences = [
    "What's the weather like in Auckland?",
    "What's the weather like today?",
   "How's the weather?",
    "What's the weather tomorrow in Sydney?",
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
    constructor(query, date, city) {
        this.query = query;
        this.date = date;
        this.city = city;

        this.get = this.get.bind(this);
    }

    get() {
        return forecastClient.forecast(this.city.lat, this.city.lng);
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

    let cities = locationHelper.citiesInTokens(tokenized);

    // More dodginess, we default to the first city.
    // If we didn't get any, use Christchurch, because why not?
    return new Weather(sentence, date._d, cities[0] || {
        city: "Christchurch",
        country: "New Zealand",
        lat: -43.5321,
        lng: 172.6362
    });
}

testSentences.forEach(sentence => {
    const weather = evaluateSentence(sentence);
    if (!weather) return;
    
    console.log(weather);
    weather.get().then(result => console.log(result.daily.summary));
});