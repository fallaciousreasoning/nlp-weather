const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');
const Tree = require('bintrees').BinTree;

class City {
    constructor(record) {
        this.country = record[0];
        this.city = record[1];
        this.name = record[1].toLowerCase();
        this.lat = record[2];
        this.lng = record[3];
        this.alt = record[4];
    }
}

// Trees for storing cities
const cityTree = new Tree((a, b) => {
    if (a.name < b.name) {
        return -1;
    }

    if (a.name > b.name) {
        return 1;
    }

    // Assume that if the country hasn't been set then we're querying the tree..
    if (!a.country || !b.country) return 0;
    
    if (a.country < b.country) {
        return -1;
    }

    if (a.country > b.country) {
        return 1;
    }

    // If the countries match and the cities match it should be the same city.
    return 0;
});

// Create the parser
const parser = parse({
    delimiter: ';'
});

// Use the writable stream api
parser.on('readable', () => {
    let record;
    while (record = parser.read()) {
        const city = new City(record);
        cityTree.insert(city);
    }
});

const inputStream = fs.createReadStream('world-cities.csv');

const inputText = fs.readFileSync('world-cities.csv');
parser.write(inputText);

const getCity = city => {
        if (typeof city === 'string') {
            return cityTree.find({name: city.toLowerCase()});
        }

        return cityTree.find(city);
}

module.exports = {
    exists: city => {
        return getCity(city) !== null;
    },

    get: getCity,

    citiesInTokens: tokens => {
        const cities = tokens.map(token => getCity(token)).filter(city => city !== null);
        return cities;
    }
}