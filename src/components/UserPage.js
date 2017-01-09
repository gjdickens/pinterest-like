// src/components/UserPage.js
import React from 'react';
import Gallery from './Gallery';
import { ListGroup, Pagination, Jumbotron, Button } from 'react-bootstrap';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link } from 'react-router';
if(process.env.WEBPACK) require('./IndexPage.scss');

export default ({app, params}) => {
    let loggedIn = app.state.loggedIn;
    let data = app.state.data.filter(function(arr) {
      return arr.username === params.userId;
    });

    return (
      <div>
        <div>
        {app.state.loggedIn.user === params.userId ?
          <Button block onClick={app.showAddModal}>Add Pic</Button>
          :
          <div></div>
        }
            {data.length > 0 ?
                <Gallery
                  className="gallery"
                  picData={data}
                  loggedIn={loggedIn}
                  app={app}/>
                  :
                  <h3>No Pics Yet</h3>
              }

        </div>
        <footer>
        </footer>
      </div>
    );
}
