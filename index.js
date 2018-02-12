const mb = require("musicbrainz");
var request1 = require('request');
const fs = require('fs');
const https = require('https');
const request = require('request-promise');
var querystring = require('querystring');
const async = require("async");
const promise = require("promise");
// för att få wiki
//http://musicbrainz.org/ws/2/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da?inc=url-rels&fmt=json


const options = {
    method: 'GET',
    url: 'http://musicbrainz.org/ws/2/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da?inc=url-rels&fmt=json',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'xx.xx@xx.com'
    }
};
//console.log("---OPTS---", options);
request(options, function(error, response, body) {
    if (error) { return console.log(error); }
    let json = JSON.parse(body);
    var str = JSON.stringify(json, null, 2);
    //var wikiUrl = json["relations"][37]["url"][1]; 
    var wikiUrl = json["relations"]; //skriver ut obj
    var found = wikiUrl.find(element => {
        if (element.type === "wikipedia") {
            return element;
        }
    });

    //console.log(str);
    console.log(found.url.resource);
    //---------------------------------------------------------
    //https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=Nirvana_(band)
    //nytt request för att hämta ny data från wiki

    var split = found.url.resource.split('/').pop();


    var newWikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=' + split;
    // console.log('----NEWWIKI----', newWikiUrl);
console.log(split);

    const wikiOpts = {
        method: 'GET',
        url: newWikiUrl,

        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'xx.xx@xx.com'
        }
    }

    //console.log("New opts", wikiOpts);
    request(wikiOpts, function(error, response, body) {
        //if (error) { return console.log(error); }
        if (error) {
            console.log('an error happened');
            return console.log(error);

        }

        // console.log('the body:', body);
        let json = JSON.parse(body);
        var str = JSON.stringify(json, null, 2);
        //console.log('Description', str);
        // console.log(str);
    })


});
//---------------------------------------------------------


const Artoptions = {
    method: 'GET',
    url: 'http://musicbrainz.org/ws/2/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da?inc=release-groups&fmt=json',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'xx.xx@xx.com'
    }
};

request(Artoptions, function(error, response, body) {
    if (error) {
        console.log('an error happened');
        return console.log(error);
    }

    let json = JSON.parse(body);
    var str = JSON.stringify(json, null, 2);

    var albumsUrl = json["release-groups"];


    let albums = [];
    //var album = Object.keys(albumsUrl);
    // *albumsUrl.forEach(function(item, index) {
    albumsUrl.forEach(function(title) {
        if (title["primary-type"] === "Album") {
            albums.push({ name: title.title, mbid: title.id })

            //*if (item['primary-type'] === "Album") {
            //albums.push({ name: title.title, mbid: title.id });
            //console.log('----------Print item----------------------', item);
            //console.log('----------Print index----------------------', index);
            //*albums.push({ id: item.id })
        }

    })







})


