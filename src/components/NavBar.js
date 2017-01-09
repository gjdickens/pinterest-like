import React from 'react';
import { Navbar, FormGroup, Button, FormControl, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
if(process.env.WEBPACK) require('./NavBar.scss');

export default ({normalLogin, showRegister, register, logout, usernameChange, passwordChange, username, password, loggedIn, loginTwitter}) => {
    return <NavBar
      handleLogin={normalLogin}
      handleRegister={register}
      showRegister={showRegister}
      handleLogout={logout}
      handleUsernameChange={usernameChange}
      handlePasswordChange={passwordChange}
      username={username}
      password={password}
      loggedIn={loggedIn}
      loginTwitter={loginTwitter} />;
}

class NavBar extends React.Component {
  render() {
    return (
        <Navbar id="mainNav" fixedTop>
            <Navbar.Header>
              <Navbar.Toggle />
            </Navbar.Header>
            <Nav>
              <LinkContainer to="/">
                <NavItem eventKey={1}>All Pics</NavItem>
              </LinkContainer>
              { this.props.loggedIn.isLoggedIn ?
              <LinkContainer to={'/' + this.props.loggedIn.user}>
                <NavItem eventKey={2}>My Pics</NavItem>
              </LinkContainer>
              :
              <NavItem></NavItem>
            }
            </Nav>
            <Navbar.Collapse>
              <Navbar.Form  pullRight>
              { this.props.loggedIn.isLoggedIn ?
                <div>
                <FormGroup>
                  <FormControl.Static className="loggedInUser">{this.props.loggedIn.user} </FormControl.Static>
                </FormGroup>
                <Button className="navButton" onClick={this.props.handleLogout}>Logout</Button>
                </div>
                :
                <div>
                <FormGroup>
                  <FormControl type='text' onChange={this.props.handleUsernameChange} defaultValue={this.props.username} name="username" placeholder="Username"/>
                  <FormControl type="password" onChange={this.props.handlePasswordChange} defaultValue={this.props.password} name="password" placeholder="Password" />
                </FormGroup>
                <Button className="navButton" onClick={this.props.handleLogin}>Login</Button>
                <Button className="navButton" onClick={this.props.showRegister}>Register</Button>
                <Button className="navButton" onClick={this.props.loginTwitter}>Twitter</Button>
                </div>
              }
              </Navbar.Form>
            </Navbar.Collapse>
          </Navbar>

    );
  }
}
