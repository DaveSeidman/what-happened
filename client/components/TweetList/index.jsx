import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tweet from './Tweet';
import './scss/TweetList.scss';

export default class TweetList extends Component {
  static propTypes = {
    tweets: PropTypes.arrayOf(PropTypes.shape({
      user_name: PropTypes.string,
      user_handle: PropTypes.string,
      text: PropTypes.string,
    })).isRequired,
  }

  constructor(props) {
    super(props);

    this.img = 'test.jpg';
  }

  isAdmin() {
    return false;
  }

  render() {
    console.log('state', this.state);
    const { tweets } = this.props;

    return (
      <div className="tweetlist">
        {
          tweets.map((tweet, index) => {
            const id = index;

            return (
              <Tweet
                index={index}
                key={`tweet-${id}`}
                user={tweet.user_name}
                handle={tweet.user_handle}
                tweet={tweet.text}
                retweets={tweet.retweets}
                favorites={tweet.favorites}
                image={tweet.user_photo}
                admin={this.isAdmin()}
              />
            );
          })
        }
      </div>
    );
  }
}
