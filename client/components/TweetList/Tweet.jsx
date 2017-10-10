import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './scss/Tweet.scss';

export default class Tweet extends Component {
  static propTypes = {
    user: PropTypes.string,
    handle: PropTypes.string,
    tweet: PropTypes.string,
    retweets: PropTypes.number,
    favorites: PropTypes.number,
    image: PropTypes.string,
    admin: PropTypes.bool,
  };

  static defaultProps = {
    user: '',
    handle: '',
    tweet: '',
    retweets: 0,
    favorites: 0,
    image: 'dummy.jpg',
    admin: false,
  };

  approveTweet(e) {
    console.log('approving tweet', e.target);
  }

  rejectTweet(e) {
    console.log('reject tweet', e);
  }

  render() {
    const {
      user,
      handle,
      tweet,
      image,
      retweets,
      favorites,
      admin,
    } = this.props;
    return (
      <div className="tweet">
        <div className="tweet-user">
          <img className="tweet-user-image" src={image} alt="profile pic" />
          <div className="tweet-user-info">
            <h1 className="tweet-user-info-name">{user}</h1>
            <h2 className="tweet-user-info-handle">@{handle}</h2>
          </div>
        </div>
        <p className="tweet-text">{tweet}</p>
        <hr />
        <div className="tweet-stats">
          <div className="tweet-stats-retweets">
            <p>Retweets:</p>
            <h1>{retweets}</h1>
          </div>
          <div className="tweet-stats-favorites">
            <p>Favorites:</p>
            <h1>{favorites}</h1>
          </div>
        </div>
        { admin ? (
          <div className="tweet-control">
            <button className="tweet-control-approve" onClick={this.approveTweet}>Approve</button>
            <button className="tweet-control-reject" onClick={this.rejectTweet}>Reject</button>
          </div>
        ) : ''
        }
      </div>
    );
  }
}
