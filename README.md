# MusicMashup

REST API which simply provides a mashup of some underlying APIs. APIs which will be combined are MusicBrainz, Wikipedia and Cover Art Archive.

MusicBrainz provides an API with detailed information about music artists (name, year of birth, country, etc.).
Wikipedia is a community wiki which contains descriptive information about music artists.
Cover Art Archive is a sister project of MusicBrainz which includes cover images of different albums, singles, eps etc. released by an artist.
Music Mashup API receives an MBID (MusicBrainz Identifier) and returns data consisting of

Description of the artist is taken from Wikipedia. Wikipedia does not contain any MBID without mapping between MBID and Wikipedia identifiers available through MusicBrainz API.
List of all albums released by artist and links to images for each album. List of albums is available in MusicBrainz but pictures are on Cover Art Archive.

test