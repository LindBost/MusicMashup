const recLib = require('./requests');
//console.log(recLib.getDescription('Nirvana_(band)'));

recLib.getwikiName('5b11f4ce-a62d-471e-81fc-a69a8278c7da')
    .then(res => {
        console.log('Description: ', res);
        return recLib.getDescription(res); // skickar med wikiName
    })
    .then(res => {
        console.log(res);
        return recLib.getAlbums('5b11f4ce-a62d-471e-81fc-a69a8278c7da'); //anger MBID
        //res = det jag retunerar i föregående function 

    })
    .then(res => {
        console.log('Albums: ', res);
        return recLib.getCoverArt(res)
    })
    .then(res => {
        console.log(res);
    })




//5b11f4ce-a62d-471e-81fc-a69a8278c7da
//2bcf2e02-5bc3-4c76-bf76-41126cb11444
