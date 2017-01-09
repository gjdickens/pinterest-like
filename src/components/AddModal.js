import React from 'react';
import { Modal, FormGroup, Button, FormControl, Col } from 'react-bootstrap';


export default ({showAddModal, closeModal, selectedPic, handleTitleChange, handleLinkChange, handlePostPic, swapImage, imgChange}) => {
    return (
      <Modal className="modal" show={showAddModal} onHide={closeModal}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title>Post Picture</Modal.Title>
        </Modal.Header>
            <Modal.Body className="modal-body">
              <FormGroup>
                <Col xs={2}>Title:</Col>
                <Col xs={10}>
                    <FormControl type='text' onChange={handleTitleChange} placeholder="Title" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={2}>Image Link:</Col>
                <Col xs={10}>
                <FormControl type='text' onChange={handleLinkChange} placeholder="Image Link" />
                </Col>
              </FormGroup>
              <FormGroup>
                {selectedPic.image_url ?
                  <img className="img-responsive" src={selectedPic.image_url} onLoad={imgChange} onError={swapImage} />
                  :
                  <div></div>
                }
              </FormGroup>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
              <div className="text-center">
              <Button onClick={handlePostPic} className="btn">Post</Button>
              </div>
            </Modal.Footer>
      </Modal>

    );
}
