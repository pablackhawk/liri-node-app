// Dependencies
let keys = require('./keys.js')
const twitter = require('twitter')
const spotify = require('node-spotify-api')
const fetch = require('node-fetch')
var inquirer = require('inquirer')
const fs = require('fs')

// User Input capture and instructions
inquirer.prompt([
  {
    type: 'list',
    name: 'action',
    message: 'Welcome to Liri! Make a Selection below:',
    choices: ['My Tweets', 'Spotify This Song', 'Movie This', 'Do What It Says']
  },
  {
    type: 'input',
    name: 'searchTerm',
    message: 'What song would you like to search for?',
    default: 'Hear You Me',
    when: function (answers) {
      return answers.action === 'Spotify This Song'
    }

  },
  {
    type: 'input',
    name: 'searchTerm',
    message: 'What movie are you looking for?',
    default: 'Top Gun',
    when: function (answers) {
      return answers.action === 'Movie This'
    }
  }

]).then(function (answers) {
  let action = ''
  let searchTerm = answers.searchTerm
  if (answers.action === 'My Tweets') {
    fetchTweets()
  } else if (answers.action === 'Spotify This Song') {
    spotifyMe()
  } else if (answers.action === 'Movie This') {
    movieMe()
  } else if (answers.action === 'Do What It Says') {
    followTheBook()
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
          let returnedData = ('Number: ' + (j + 1) + '\n' + tweets[j].created_at + '\n' + tweets[j].full_text || tweets[j].text + '\n')
          console.log(returnedData)
          console.log('--------------------')
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
        console.log("This is the top result I've found for that search:")
        let response = data.tracks.items
        console.log('Track Title: ' + response[0].name)
        console.log('Artist: ' + response[0].artists[0].name)
        console.log('Album: ' + data.tracks.items[0].album.name)
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
})
