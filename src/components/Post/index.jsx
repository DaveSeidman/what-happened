import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './scss/Post.scss';

export default class Post extends Component {
  static propTypes = {
    test: PropTypes.number,
  };

  static defaultProps = {
    test: 0,
  };

  constructor(props) {
    super(props);

    this.test = props.test * 2;
  }

  render() {
    return (
      <div className="post">Testing{this.test}</div>
    );
  }
}
