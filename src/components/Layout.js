// src/components/Layout.js
import React from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link, browserHistory } from 'react-router';
import NavBar from './NavBar';
import RegisterModal from './RegisterModal';
import EditModal from './EditModal';
import AddModal from './AddModal';
import io from 'socket.io-client';
if(process.env.WEBPACK) require('./Layout.scss');

const socket = io.connect('https://gj-pinterest-like.herokuapp.com/');
//const socket = io.connect('localhost:3000');

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.usernameChange = this.usernameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.showRegister = this.showRegister.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closePicModal = this.closePicModal.bind(this);
    this.modalUsernameChange = this.modalUsernameChange.bind(this);
    this.modalPasswordChange = this.modalPasswordChange.bind(this);
    this.normalLogin= this.normalLogin.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.postPic = this.postPic.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleEditPic = this.handleEditPic.bind(this);
    this.handleDeletePic = this.handleDeletePic.bind(this);
    this.handlePostPic = this.handlePostPic.bind(this);
    this.handlePicClick = this.handlePicClick.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.swapImage = this.swapImage.bind(this);
    this.imgChange = this.imgChange.bind(this);
    this.twitterLogin = this.twitterLogin.bind(this);
    this.loginTwitter = this.loginTwitter.bind(this);

    this.state = {
      username: "",
      password: "",
      showRegisterModal: false,
      loggedIn: {
        isLoggedIn: false,
        user: ""
      },
      modalInput: {
        username: "",
        password: ""
      },
      data: [],
      selectedPic: {},
      showEditModal: false,
      showAddModal: false
    }
  }

  componentDidMount() {
    console.log(this.props);
    var that = this;

    socket.on('picData', function(data) {
      that.setState({data: data });
    });


    socket.on('newPicData', function(data) {
        let newData = that.state.data.concat([data]);
        that.setState({data: newData });
    });

    socket.on('deletePicData', function(data) {
      that.setState({
        data: that.state.data.filter(function(selected) { return selected._id !== data._id })
      });
    });

    socket.on('editPicData', function(data) {
      that.setState({
        data: that.state.data.map(function(selected) {
          if(selected._id === data._id) {
            selected = data;
          }
          return selected;
        })
      });
      });

  }

  swapImage(e) {
    e.target.src ='https://cdn4.iconfinder.com/data/icons/48-bubbles/48/18.Pictures-Day-128.png';
  };

  imgChange(e) {
    let selectedPic = JSON.parse(JSON.stringify(this.state.selectedPic));
    selectedPic.imgHeight = e.target.height / e.target.width;
    this.setState({selectedPic: selectedPic});
  };


  closePicModal() {
    this.setState({showEditModal: false, showAddModal: false, selectedPic: {} });
  }

  showEditModal(pic) {
    this.setState({showEditModal: true, selectedPic: pic});
  }

  showAddModal() {
    this.setState({showAddModal: true});
  }

  postPic(newPic) {
    this.closePicModal();
    socket.emit('newPic', newPic);
  }

  handleTitleChange(e) {
    let selectedPic = JSON.parse(JSON.stringify(this.state.selectedPic));
    selectedPic.title = e.target.value;
    this.setState({selectedPic: selectedPic});
  }

  handleLinkChange(e) {
    let selectedPic = JSON.parse(JSON.stringify(this.state.selectedPic));
    selectedPic.image_url = e.target.value;
    this.setState({selectedPic: selectedPic});
  }


  handleEditPic() {
    let selectedPic = JSON.parse(JSON.stringify(this.state.selectedPic));
    socket.emit('editPic', selectedPic);
    this.closePicModal();
  }

  handleDeletePic() {
    let selectedPic = JSON.parse(JSON.stringify(this.state.selectedPic));
    socket.emit('deletePic', selectedPic);
    this.closePicModal();
  }

  handlePostPic() {
    let selectedPic = JSON.parse(JSON.stringify(this.state.selectedPic));
    selectedPic.username = this.state.loggedIn.user;
    this.postPic(selectedPic);
  }

  login(username, password){
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: myHeaders
      };
    fetch('/login', options)
    .then(function(response) {
      if (response.status === 200) {
        that.setState({"loggedIn": {"user": username, "isLoggedIn": true }, "username": "", "password": "" });
      }

    });
  }

  loginTwitter(){
    window.location = 'auth/twitter';
  }

  twitterLogin(username) {
    this.setState({"loggedIn": {"user": username, "isLoggedIn": true }, "username": "", "password": "" });
  }


  normalLogin() {
    this.login(this.state.username, this.state.password);
  }

  register(){
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        username: this.state.modalInput.username,
        password: this.state.modalInput.password
      }),
      headers: myHeaders
      };
    fetch('/register', options)
    .then(function(response) {
      if (response.status === 200) {
        that.login(that.state.modalInput.username, that.state.modalInput.password);
        that.closeModal();
      }
    });
    }


  closeModal() {
    this.setState({"showRegisterModal": false});
  }


  usernameChange(e) {
    this.setState({"username": e.target.value});
  }

  passwordChange(e) {
    this.setState({"password": e.target.value});
  }

  showRegister() {
    this.setState({"showRegisterModal": true});
  }

  logout() {
    var that = this;
    fetch('/logout')
      .then(function(response) {
        that.setState({"loggedIn": {"user": "", "isLoggedIn": false }, "username": "", "password": "" });
        browserHistory.push('/');
      })
  }

  modalUsernameChange(e) {
    this.setState({"modalInput": {"username": e.target.value, "password": this.state.modalInput.password}});
  }

  modalPasswordChange(e) {
    this.setState({"modalInput": {"username": this.state.modalInput.username, "password": e.target.value }});
  }

  handlePicClick(picData, e) {
    e.preventDefault();
    e.stopPropagation();
    this.showEditModal(picData);
  }

  handleUserClick(picData, e) {
    e.preventDefault();
    e.stopPropagation();
    browserHistory.push('/' + picData.username);
  }


  render() {
    return (
      <div className="app-container">
        <header>
          <NavBar
            normalLogin={this.normalLogin}
            register={this.register}
            showRegister={this.showRegister}
            logout={this.logout}
            usernameChange={this.usernameChange}
            passwordChange={this.passwordChange}
            username={this.state.username}
            password={this.state.password}
            loggedIn={this.state.loggedIn}
            loginTwitter={this.loginTwitter} />
        </header>
        <div className="app-content">{React.cloneElement(this.props.children, { app: this })}</div>
        <footer>
          <RegisterModal
            showModal={this.state.showRegisterModal}
            closeModal={this.closeModal}
            modalUsernameChange={this.modalUsernameChange}
            modalPasswordChange={this.modalPasswordChange}
            register={this.register} />
          <AddModal
            showAddModal={this.state.showAddModal}
            closeModal={this.closePicModal}
            selectedPic={this.state.selectedPic}
            loggedIn={this.state.loggedIn}
            handleTitleChange={this.handleTitleChange}
            handleLinkChange={this.handleLinkChange}
            handlePostPic={this.handlePostPic}
            swapImage={this.swapImage}
            imgChange={this.imgChange} />
          <EditModal
            showEditModal={this.state.showEditModal}
            closeModal={this.closePicModal}
            selectedPic={this.state.selectedPic}
            loggedIn={this.state.loggedIn}
            handleTitleChange={this.handleTitleChange}
            handleLinkChange={this.handleLinkChange}
            handleEditPic={this.handleEditPic}
            handleDeletePic={this.handleDeletePic}
            swapImage={this.swapImage}
            imgChange={this.imgChange} />
        </footer>
      </div>
    );
  }
}
