// Dependencies
let keys = require('./keys.js')
const twitter = require('twitter')
const spotify = require('node-spotify-api')
const fetch = require('node-fetch')
const fs = require('fs')
// User Input capture and instructions
console.log('Welcome to Liri!')
console.log('Available Commands:')
console.log('* my-tweets')
console.log('* spotify-this-song')
console.log('* movie-this')
console.log('* do-what-it-says')
let action = process.argv[2]
let searchTerm = process.argv[3]
for (let i = 4; i < process.argv.length; i++) {
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
  let client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  })
  let parameters = {
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
      for (let j = 0; j < tweets.length; j++) {
        let twitterData = ('Tweet Number: ' + (j + 1) + '\n' + tweets[j].created_at + '\n' + tweets[j].full_text || tweets[j].text + '\n')
        console.log(twitterData)
        console.log('--------------------')
        log(twitterData)
      }
    }
  })
}
function spotifyMe () {
  let spotifySearch = new spotify({
    id: keys.spotifyKeys.client_key,
    secret: keys.spotifyKeys.client_secret
  })
  console.log('--------------------')
  console.log("Let's play that music!")
  let searchSong
  if (searchTerm === undefined) {
    searchSong = 'The Sign'
  } else {
    searchSong = searchTerm
  }
  spotifySearch.search({ type: 'track', query: searchSong }, function (err, data) {
    if (err) {
      console.log('An error has occurred: ' + err)
    } else {
      let response = data.tracks.items
      let spotifyData = ('This is the top result I\'ve found for that search\n' + 'Track Title: ' + response[0].name + '\n' + 'Artist: ' + response[0].artists[0].name + '\n' + 'Album: ' + response[0].album.name)
      console.log(spotifyData)
      log(spotifyData)
      if (response[0].preview_url === null) {
        console.log('Preview: No preview available')
      } else {
        console.log('Preview: ' + response[0].preview_url)
      }
      console.log('--------------------')
    }
  })
}
function movieMe () {
  console.log('--------------------')
  console.log("Let's go to the movies!")
  let searchMovie
  if (searchTerm === undefined) {
    searchMovie = 'Mr. Nobody'
  } else {
    searchMovie = searchTerm
  }
  fetch('https://www.omdbapi.com/?t=' + searchMovie + '&y=&plot=long&tomatoes=true&apikey=' + keys.omdbKey.apiKey).then(
  response => response.json().then(json => {
    let movieData = ('Title: ' + json['Title'] + '\n' + 'Year: ' + json['Year'] + '\n' + 'IMDB Rating: ' + json['imdbRating'] + '\n' + 'Country: ' + json['Country'] + '\n' + 'Language: ' + json['Language'] + '\n' + 'Plot: ' + json['Plot'] + '\n' + 'Actors: ' + json['Actors'] + '\n' + 'Rotten Tomatoes Rating: ' + json['tomatoRating'] + '\n' + 'Rotten Tomatoes URL: ' + json['tomatoURL'])
    console.log(movieData)
    console.log('--------------------')
    log(movieData)
  }).catch(error => {
    console.log(error)
    console.log('--------------------')
  })
  )
}
function followTheBook () {
  console.log('--------------------')
  console.log('Opening the book...')
  fs.readFile('./random.txt', 'utf8', function (err, data) {
    if (err) {
      console.log('An error occurred: ' + err)
    } else {
      let dataArr = data.split(', ')
      action = dataArr[0]
      searchTerm = dataArr[1]
      console.log(dataArr[1])
    }
    execute()
  })
}
function log (logResults) {
  fs.appendFile('log.txt', logResults, err => {
    if (err) {
      throw err
    }
  })
}
execute()
