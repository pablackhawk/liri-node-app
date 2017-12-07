// Dependencies
var keys = require('./keys.js')
var twitter = require('twitter')
var fetch = require('node-fetch')
var fs = require('fs')
// User Input capture and instructions
console.log('Welcome to Liri!')
console.log('Available Commands:')
console.log('* my-tweets')
console.log('* spotify-this-song')
console.log('* movie-this')
console.log('* do-what-it-says')
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
  if (searchTerm !== undefined) {
    var spotify = require('spotify')

    spotify.search({
      type: 'track',
      query: searchTerm + '&limit=1&'
    }, function (error, data) {
      if (error) {
        console.log('Error occurred: ' + error)
        return
      }
      console.log('---------------------------------------------------')
      console.log(' ')
      console.log('The song you entered was ' + searchTerm + '.')
      console.log(' ')
      console.log('Here is the information you requested!')
      console.log(' ')
      console.log('Track Title: ' + data.tracks.items[0].name)
      console.log(' ')
      console.log('Artist Name: ' + data.tracks.items[0].artists[0].name)
      console.log(' ')
      console.log('Preview URL: ' + data.tracks.items[0].preview_url)
      console.log(' ')
      console.log('---------------------------------------------------')
    })
  } else {
    var spotify = require('spotify')

    spotify.search({
      type: 'track',
      query: 'ace+of+base+sign' + '&limit=1&'
    }, function (error, data) {
      if (error) {
        console.log('Error occurred: ' + error)
        return
      }
        // DO SOMETHING WITH 'data'
      console.log('---------------------------------------------------')
      console.log(' ')
      console.log("Since you didn't enter a song here is the following: ")
      console.log(' ')
      console.log('Track Title: ' + data.tracks.items[0].name)
      console.log(' ')
      console.log('Artist Name: ' + data.tracks.items[0].artists[0].name)
      console.log(' ')
      console.log('Preview URL: ' + data.tracks.items[0].preview_url)
      console.log(' ')
      console.log('---------------------------------------------------')
    })
  }
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
  fetch('https://www.omdbapi.com/?t=' + searchMovie + '&y=&plot=long&tomatoes=true&apikey=64293104').then(
  response => response.json().then(json => {
    console.log('Title: ' + json['Title'])
    console.log('Year: ' + json['Year'])
    console.log('IMDB Rating: ' + json['imdbRating'])
    console.log('Country: ' + json['Country'])
    console.log('Language: ' + json['Language'])
    console.log('Plot: ' + json['Plot'])
    console.log('Actors: ' + json['Actors'])
    console.log('Rotten Tomatoes Rating: ' + json['tomatoRating'])
    console.log('Rotten Tomatoes URL: ' + json['tomatoURL'])
    console.log('--------------------')
  }).catch(error => {
    console.log(error)
    console.log('--------------------')
  })
  )
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
