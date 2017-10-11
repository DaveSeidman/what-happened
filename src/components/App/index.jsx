import React, { Component } from 'react';
import Post from '../Post/';
import TweetList from '../TweetList/';
import './scss/App.scss';

const isLocal = window.location.hostname === 'localhost';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tweets: [],
    };

    this.update = this.update.bind(this);
    this.update();
  }

  update() {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = (() => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          console.log(JSON.parse(httpRequest.responseText));
          this.setState({ tweets: JSON.parse(httpRequest.responseText) });
        } else {
          console.log('couldn\'t load tweets');
        }
      }
    });

    httpRequest.open('GET', isLocal
      ? 'http://localhost:3000/getAllTweets'
      : '/getAllTweets');
    httpRequest.send();
  }

  render() {
    const { tweets } = this.state;
    return (
      <div className="app">
        <Post
          test={1}
          data="testing1"
        />
        <TweetList
          tweets={tweets}
        />
      </div>
    );
  }
}
