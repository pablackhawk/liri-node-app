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
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  })
  var parameters = {
    screen_name: 'belowdecks_sot',
    count: 20
  }
  client.get('statuses/user_timeline', parameters, function (error, tweets, response) {
    if (error) {
      console.log('An error occurred')
    } else {
      for (var j = 0; j < tweets.length; j++) {
        var returnedData = ('Number: ' + (i + 1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n')
        console.log(returnedData)
        console.log('--------------------')
      }
    }
  })
}
