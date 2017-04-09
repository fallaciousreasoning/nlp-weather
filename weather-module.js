const nlpWeather = require('./nlp-weather');

exports.match = (event) => {
    return !!nlpWeather.parse(event.body);
}

exports.run = (api, event) => {
    const weather = nlpWeather.parse(event.body);
    weather.get().then(summary => api.sendMessage(summary, event.thread_id));
}