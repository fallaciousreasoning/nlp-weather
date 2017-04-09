const nlpWeather = require('./nlp-weather');

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

testSentences.forEach(sentence => {
    const weather = nlpWeather.parse(sentence);
    if (!weather) return;

    weather.get().then(forecast => console.log(`Evaluating sentence "${sentence}"\n===========================================================================\n${forecast}\n===========================================================================\n`));
});