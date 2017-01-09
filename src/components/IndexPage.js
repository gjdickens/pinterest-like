// src/components/IndexPage.js
import React from 'react';
import PicPreview from './PicPreview';
import Gallery from './Gallery';
import { ListGroup, Pagination, Jumbotron, Button } from 'react-bootstrap';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link } from 'react-router';
if(process.env.WEBPACK) require('./IndexPage.scss');

export default ({app}) => {
    let loggedIn = app.state.loggedIn;
    let data = app.state.data;

    return (
      <div>
        <div>
              {app.state.loggedIn.isLoggedIn ?
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
                <h3>Loading</h3>
            }

        </div>
        <footer>
        </footer>
      </div>
    );
}
