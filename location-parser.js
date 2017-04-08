const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');
const Tree = require('bintrees').BinTree;

class City {
    constructor(record) {
        this.country = record[0];
        this.city = record[1];
        this.lat = record[2];
        this.lng = record[3];
        this.alt = record[4];
    }
}

// Trees for storing cities
const cityTree = new Tree((a, b) => {
    if (a.city < b.city) {
        return -1;
    }

    if (a.city > b.city) {
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

module.exports = {
    exists: city => {
        return this.get(city) !== null;
    },

    get: city => {
        if (city instanceof String) {
            return cityTree.find({city: city});
        }

        return cityTree.find(city);
    }
}