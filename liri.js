// Dependencies
var keys = require('./keys.js')
var twitter = require('twitter')
var spotify = require('spotify')
var request = require('request')
var fs = require('fs')
// User Input capture and instructions
console.log('Welcome to Liri!')
console.log('Available Commands:')
console.log('my-tweets')
console.log('spotify-this-song')
console.log('movie-this')
console.log('do-what-it-says')
var action = process.argv[2]
var searchTerm = process.argv[3]
for (var i = 4; i < process.argv.length; i++) {
  searchTerm += '+' + process.argv[i]
}

function execute () {
  switch (action) {
    case 'my-tweets':
      fetchTweets()
      break

    case 'spotify-this-song':
      spotifyMe()
      break

    case 'movie-this':
      movieMe()
      break

    case 'do-what-it-says':
      followTheBook()
      break
  }
}

function fetchTweets () {
  console.log('Tweets incoming...')
  var client = new twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
  })
  var parameters = {
    screen_name: 'belowdecks_sot',
    count: 20,
    exclude_replies: true,
    tweet_mode: 'extended'
  }
  client.get('statuses/user_timeline', parameters, function (error, tweets, response) {
    if (error) {
      console.log('An error occurred: ' + error)
    } else {
      console.log('--------------------')
      for (var j = 0; j < tweets.length; j++) {
        var returnedData = ('Number: ' + (j + 1) + '\n' + tweets[j].created_at + '\n' + tweets[j].full_text || tweets[j].text + '\n')
        console.log(returnedData)
        console.log('--------------------')
      }
    }
  })
}
function spotifyMe () {
  console.log('--------------------')
  console.log('Here is some music for you!')
  var searchTrack
  if (searchTerm === undefined) {
    searchTrack = "What's My Age Again?"
  } else {
    searchTrack = searchTerm
  }
  spotify.search({type: 'track', query: searchTrack}, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err)
      console.log('--------------------')
    } else {
      console.log('Artist: ' + data.tracks.items[0].artists[0].name)
      console.log('Song: ' + data.tracks.items[0].name)
      console.log('Album: ' + data.tracks.items[0].album.name)
      console.log('Preview Here:' + data.tracks.items[0].preview_url)
      console.log('--------------------')
    }
  })
}
function movieMe () {
  console.log('--------------------')
  console.log("Let's go to the movies!")
  var searchMovie
  if (searchTerm === undefined) {
    searchMovie = 'Mr. Nobody'
  } else {
    searchMovie = searchTerm
  }
  var url = 'https://www.omdbapi.com/?t=' + searchMovie + '&y=&plot=long&tomatoes=true&r=json'
  request(url, function (error, response, body) {
    var movieResponse = JSON.parse(body)
    if (!error && response.statusCode === 200) {
      console.log('Title: ' + movieResponse['Title'])
      console.log('Year: ' + movieResponse['Year'])
      console.log('IMDB Rating: ' + movieResponse['imdbRating'])
      console.log('Country: ' + movieResponse['Country'])
      console.log('Language: ' + movieResponse['Language'])
      console.log('Plot: ' + movieResponse['Plot'])
      console.log('Actors: ' + movieResponse['Actors'])
      console.log('Rotten Tomatoes Rating: ' + movieResponse['tomatoRating'])
      console.log('Rotten Tomatoes URL: ' + movieResponse['tomatoURL'])
      console.log('--------------------')
    } else if (error) {
      console.log(error)
      console.log('--------------------')
    }
  })
}
function followTheBook () {
  console.log('--------------------')
  console.log('Opening the book...')
  fs.readFile('random.txt', 'utf8', function (error, data) {
    if (error) {
      console.log(error)
    } else {
      var dataArr = data.split(', ')
      action = dataArr[0]
      searchTerm = dataArr[1]
      for (var k = 0; k < dataArr.length; k++) {
        searchTerm = searchTerm + '+' + dataArr[i]
      }
    }
    execute()
  })
}
execute()
