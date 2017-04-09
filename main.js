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

const test = () => {
    const testPromises = testSentences.map(sentence => {
        const weather = nlpWeather.parse(sentence);
        if (!weather) return;

        return weather.get().then(forecast => console.log(`Evaluating sentence "${sentence}"\n===========================================================================\n${forecast}\n===========================================================================\n`));
    });

    return Promise.all(testPromises);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const inputLoop = () => {
    rl.question("Enter query (or test, or exit): ", answer => {
        if (answer.toLowerCase() === 'exit') {
            process.exit(0);
            return;
        }
        if (answer.toLowerCase() == 'test') {
            console.log('running tests...');
            test().then(inputLoop);
            return;
        }

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