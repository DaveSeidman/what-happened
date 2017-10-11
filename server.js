const express = require('express')
const app = express()
const request = require('request')
const mongoose = require('mongoose')
const config = require('./config.json')

const twitterSecret = new Buffer(config.twitter.consumer_key + ':' + config.twitter.consumer_secret).toString('base64')
const twitterQuery = 'WhatHappenedInVegas'

let token = undefined

mongoose.Promise = Promise

mongoose.connect(
  `mongodb://${config.mongo.user}:${config.mongo.pass}@` +
  `cluster0-shard-00-00-xwdmh.mongodb.net:27017,` +
  `cluster0-shard-00-01-xwdmh.mongodb.net:27017,` +
  `cluster0-shard-00-02-xwdmh.mongodb.net:27017/` +
  `${config.mongo.db}?` +
  `ssl=true&` +
  `replicaSet=Cluster0-shard-0` +
  `&authSource=admin`, { useMongoClient: true }
).then(result => {
  console.log('connected!')
})

const tweetSchema = mongoose.Schema({
  id: { type: String, unique: true },
  created: Date,
  text: String,
  user_name: String,
  user_handle: String,
  user_photo: String,
  retweets: Number,
  favorites: Number,
  user_id: Number,
  approved: Boolean,
})
const tweetModel = mongoose.model('tweets', tweetSchema)


function init() {
  lookForNewTweets()
  setTimeout(lookForNewTweets, 5000)
}


app.use(express.static('dist'))

app.get('/', (req, res) => {
  console.log('connection')
  res.send('hey there')
})
app.get('/getApprovedTweets', getApprovedTweets)
app.get('/getAllTweets', getAllTweets)
app.get('/lookForNewTweets', function(req, res) {

  init()
  res.header("Access-Control-Allow-Origin", "*")
  res.send('hey there')
})

app.listen(3000, function () {
  console.log('tweet server listening on port 3000')
})


function getApprovedTweets(req, res) {
  res.header("Access-Control-Allow-Origin", "*")
  res.send('getting just approved tweets')
}


function getAllTweets(req, res) {
  tweetModel.find(function(err, tweets) {
    if(err) return console.log(err)
    res.header("Access-Control-Allow-Origin", "*")
    res.send(tweets)
  })
}







function lookForNewTweets() {

  console.log('looking for new tweets')
  if(!token)
  getToken() // TODO: probably don't need to get a new token every time
  .then(getTweets)
  .then(storeTweets)

  else
  getTweets(token)
  .then(storeTweets)
}






// Twitter stuff
function getToken() {
  console.log('getting twitter token')

  return new Promise(function(resolve, reject) {
    var options = {
      url: 'https://api.twitter.com/oauth2/token',
      headers: {
        'Authorization': 'Basic ' + twitterSecret,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: 'grant_type=client_credentials' }

    request.post(options, function(error, response, body) {
      if(error)
        reject(error)

      token = body
      resolve(body)
    })
  })
}

function getTweets(response) {
  console.log('getting tweets')

  return new Promise(function(resolve, reject) {
    const token = JSON.parse(response).access_token
    const twitter_api = 'https://api.twitter.com/1.1/search/tweets.json'
    const options = {
      method: 'GET',
      url: twitter_api,
      qs: {
        "q": twitterQuery
      },
      json: true,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
    request(options, function(error, response, body) {
      if(error)
      reject(error)

      resolve(body)
    })
  })
}

function storeTweets(response) {
  console.log('put tweets in db')

  if(!response)
    return console.log('no tweets')

  console.log(`found ${response.statuses.length} tweets`)

  // TODO: this should eventually store ALL tweets instead of one at a time:
  //var tweet = response.statuses[Math.floor(Math.random() * response.statuses.length)]
  const tweets = response.statuses;

  for (var i = 0; i < tweets.length; i++) {
    var tweet = tweets[i]

    var newTweet = new tweetModel({
      id: tweet.id,
      text: tweet.text,
      user_id: tweet.user.id,
      user_name: tweet.user.name,
      user_handle: tweet.user.screen_name,
      user_photo: tweet.user.profile_image_url,
      date: tweet.created_at,
      retweets: tweet.retweet_count,
      favorites: tweet.favorite_count,
      approved: false,
    })

    newTweet.save(function(err, tweet) {
      if(err)
        return console.log('tweet already exists', i)

      console.log('tweet added to db', tweet.id)
    })
  }
}
