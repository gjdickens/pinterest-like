// src/components/PicPreview.js
import React from 'react';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem, Badge, Col, Button } from 'react-bootstrap';
if(process.env.WEBPACK) require('./PicPreview.scss');

export default ({handlePicClick, handleUserClick, picData, loggedIn, xsCol, mdCol, swapImage }) => {
    return (
        <div className="card container-fluid">
        <h4 className="card-title">{picData.title}</h4>
        <img className="img-responsive card-img" src={picData.image_url} onError={swapImage} />
        <p className="card-user">
          <Button block onMouseDown={handleUserClick.bind(this, picData)}>{picData.username}</Button>
        </p>
          {loggedIn.user === picData.username ?
              <Button block onMouseDown={handlePicClick.bind(this, picData)}>Edit</Button>
              :
              <div></div>
            }
            </div>

    );
}
