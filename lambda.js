const recLib = require('./requests');
//console.log(recLib.getDescription('Nirvana_(band)'));

const getFrontImage = items => {
    if (!items) return;
    let url;
    items.forEach(item => {
        if (item.front) url = item.image;
    });
    return url;
};

module.exports.handler = (ev, ctx, cb) => {
    console.log('ev', JSON.stringify(ev, null, 2));
    const res = {};

    const id = ev.queryStringParameters.id;



    recLib.getwikiName(id)
        .then(name => {
            res.name = name;
            return recLib.getDescription(name); // skickar med wikiName
        })
        .then(description => {
            res.description = description
            return recLib.getAlbums(id); //anger MBID


        })
        .then(albums => {
            res.albums = albums;
            return recLib.getCoverArt(albums);
        })
        .then(coverArts => {
            res.albums.forEach((album, i) => {
                album.image = getFrontImage(coverArts[i].images);
            });
            cb(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            });
        });

};

// handler({}, {}, (err, res) => console.log(err, res));

//5b11f4ce-a62d-471e-81fc-a69a8278c7da
//2bcf2e02-5bc3-4c76-bf76-41126cb11444
