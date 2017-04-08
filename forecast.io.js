/**
 * An API for Forecast.IO http://forecast.io
 */

const fetch = require('node-fetch')
const apiEndpoint = "https://api.darksky.net/forecast"

module.exports = class Forecast {
    constructor(token) {
        this.token = token;

        this.forecast = this.forecast.bind(this);
    }

    forecast(lat, lng) {
        const url = `${apiEndpoint}/${this.token}/${lat},${lng}?units=si`;
        return fetch(url).then(response => response.json());
    }
}