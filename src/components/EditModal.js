import React from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Modal, FormGroup, Button, FormControl, Col } from 'react-bootstrap';


export default ({showEditModal, closeModal, selectedPic, handleTitleChange, handleLinkChange, handleDeletePic, handleEditPic, swapImage}) => {
    return (
      <Modal className="modal" show={showEditModal} onHide={closeModal}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title>Edit Pic</Modal.Title>
        </Modal.Header>
            <Modal.Body className="modal-body">
              <FormGroup>
                <Col xs={2}>Title:</Col>
                <Col xs={10}>
                  <FormControl type='text' onChange={handleTitleChange} defaultValue={selectedPic.title}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={2}>Image URL:</Col>
                <Col xs={10}>
                  <FormControl type='text' onChange={handleLinkChange} defaultValue={selectedPic.image_url} />
                </Col>
              </FormGroup>
              <FormGroup>
                <img className="img-responsive" src={selectedPic.image_url} onError={swapImage}  />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
              <div className="text-center">
              <Button onClick={handleDeletePic} className="btn">Delete</Button>
              <Button onClick={handleEditPic} className="btn">Save</Button>
              </div>
            </Modal.Footer>
      </Modal>

    );
}
