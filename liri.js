
require('dotenv-extended').load();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require('moment');
var searchRequest = process.argv[2];
var searchValue = process.argv[3];
var spotify = new Spotify(keys.spotify);
var fs = require("fs");


function initial() {
    switch (searchRequest) {
        case "concert-this":
            concertSearch();
            break;

        case "spotify-this-song":
            spotify.search({ type: 'track', query: searchValue, limit: 1 })
                .then(function (response) {
                    var songInfo = response.tracks.items;
                    for (var i = 0; i < songInfo.length; i++) {
                        var songArr = songInfo[i];
                        console.log("\nArtist - " + songArr.album.artists[0].name);
                        console.log("\nSong Name - " + songArr.name);
                        console.log("\nSpotify Link - " + songArr.external_urls.spotify);
                        console.log("\nAlbum - " + songArr.album.name + "\n");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            break;

        case "movie-this":
        if (!searchValue) {
            searchValue = "Mr Nobody"
        }
            searchMovie();
            break;

        case "do-what-it-says":
            doTheRandom();

    }
}
function concertSearch() {
    axios.get("https://rest.bandsintown.com/artists/" + searchValue + "/events?app_id=codingbootcamp").then(
        function (response) {

            if (response.data.length > 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var dataArr = response.data[i];
                    var date = moment(dataArr.datetime).format('MM/DD/YYYY')
                    console.log("\nVenue - " + dataArr.venue.name);
                    console.log("\nCity - " + dataArr.venue.city);
                    console.log("\nDate - " + date + "\n");
                };
            }
            else if (response.data.length <= 0) {
                console.log("None");
            }
        })
};







function searchMovie() {

    axios.get("http://www.omdbapi.com/?t=" + searchValue + "&y=&plot=short&apikey=trilogy").then(
        function (response) {

            
           
                console.log("\nTitle - " + response.data.Title);
                console.log("\nRelease year - " + response.data.Year);
                console.log("\nIMDB rating - " + response.data.imdbRating);
                console.log("\nRotten Tomatoes - " + response.data.Ratings[1].Value);
                console.log("\nCountry - " + response.data.Country);
                console.log("\nLanguage - " + response.data.Language);
                console.log("\nPlot - " + response.data.Plot);
                console.log("\nStarring - " + response.data.Actors + "\n");

            
        }

    );
}


function doTheRandom() {
    fs.readFile("random.txt", "utf8", function (err, randomInfo) {
        if (err) {
            return console.log(err);
        } else {

            randomInfo = randomInfo.split(",");
            searchRequest = randomInfo[0];
            searchValue = randomInfo[1];
            console.log(searchRequest);
            console.log(searchValue);
            initial();

        }
    })
}

initial();