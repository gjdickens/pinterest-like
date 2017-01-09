// src/components/TwitterLogin.js
import React from 'react';
import PicPreview from './PicPreview';
import Gallery from './Gallery';
import { ListGroup, Pagination, Jumbotron, Button } from 'react-bootstrap';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link, browserHistory } from 'react-router';
//if(process.env.WEBPACK) require('./IndexPage.scss');

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.app.twitterLogin(this.props.params.userId);
    browserHistory.push('/');
  }

  render() {
    return (
      <div>
        <div>
                <h3>Loading</h3>
        </div>
        <footer>
        </footer>
      </div>
    );
  }
}
