const request = require('request-promise');
const https = require('https');
const async = require("async");
var bluebird = require("bluebird");


const getDescription = (getwikiName) => {
    const options = {
        method: 'GET',
        url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=' + getwikiName,
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'xx.xx@xx.com'
        }
    };


    //return new promise
    return new Promise(function(resolve, reject) {
        request.get(options, function(error, response, body) {
            if (error) {
                reject(error);
            }
            else {
                const obj = JSON.parse(body);
                if (obj && obj.query && obj.query.pages) {
                    const pages = obj.query.pages;
                    const firstKey = Object.keys(pages)[0];
                    const firstPage = pages[firstKey];
                    return resolve(firstPage.extract);
                }
                resolve('');
            }
        });
    });
};

const getAlbums = (mbid) => {
    //let mbid = '5b11f4ce-a62d-471e-81fc-a69a8278c7da';
    console.log('MBID', mbid);
    const options = {
        method: 'GET',
        //url: 'http://musicbrainz.org/ws/2/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da?inc=release-groups&fmt=json',
        url: 'http://musicbrainz.org/ws/2/artist/' + mbid + '?inc=release-groups&fmt=json',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'xx.xx@xx.com'
        }
    };

    return new Promise(function(resolve, reject) {
        request.get(options, function(error, response, body) {
            if (error) {
                console.log('Error happend!');
                reject(error);
            }
            else {
                let json = JSON.parse(body);
                var str = JSON.stringify(json, null, 2);
                var albumsUrl = json["release-groups"]; //skriver ut obj

                let albums = [];
                albumsUrl.forEach(function(title) {
                    if (title["primary-type"] === "Album") {
                        albums.push(({ title: title.title, mbid: title.id }));

                    }
                });
                resolve(albums);
            }
        });
    });


};
//get wikiName
const getwikiName = (mbid) => {
    const options = {
        method: 'GET',
        url: 'http://musicbrainz.org/ws/2/artist/' + mbid + '?inc=url-rels&fmt=json',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'xx.xx@xx.com'
        }
    };

    return new Promise(function(resolve, reject) {
        request.get(options, function(error, response, body) {
            if (error) {
                reject(error);
            }
            else {
                let json = JSON.parse(body);
                //var str = JSON.stringify(json, null, 2);
                var wikiUrl = json["relations"];
                var found = wikiUrl.find(element => {
                    if (element.type === "wikipedia") {
                        return element;
                    }
                });
                var split = found.url.resource.split('/').pop();
                var wikiName = split;
                resolve(wikiName);
            }

        });
    });
};

const coverArtLookup = album => {
    const options = {
        simple: false,
        method: 'GET',
        url: 'http://coverartarchive.org/release-group/' + album.mbid,
        //url: 'http://coverartarchive.org/release-group/' + albums[0].mbid,
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'xx.xx@xx.com'
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function(error, response, body) {
            if (error) {
                // console.log('an error happened', error);
                return resolve({});
            }
            else if (!(/^2/.test('' + response.statusCode))) { // Status Codes other than 2xx
                // console.log('Got a non 200 response', response.statusCode);
                return resolve({});
            }
            resolve(JSON.parse(body));
        })
    });
};

//input albums
const getCoverArt = (albums) => {
    return bluebird.map(albums, (album) => {
        return coverArtLookup(album);
    }, { concurrency: 5 });


};

module.exports = {
    getDescription,
    getAlbums,
    getwikiName,
    getCoverArt
};
