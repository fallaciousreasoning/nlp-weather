const nlpWeather = require('./nlp-weather');
const readline = require('readline');

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

inputLoop = () => {
    rl.question("Enter query (or test, or exit): ", answer => {
        if (answer.toLowerCase() === 'exit') return;

        const weather = nlpWeather.parse(answer);
        if (!weather) {
            console.log('Was that really about the weather?');
            inputLoop();
            return;
        }

        weather.get().then(summary => {
            console.log(summary);
            inputLoop();
        });
    });
};

inputLoop();