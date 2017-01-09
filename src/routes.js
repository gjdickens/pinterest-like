import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import IndexPage from './components/IndexPage';
import UserPage from './components/UserPage';
import TwitterLogin from './components/TwitterLogin';
import NotFoundPage from './components/NotFoundPage';


const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={IndexPage}/>
    <Route path="/:userId" component={UserPage}/>
    <Route path="/twitterlogin/:userId" component={TwitterLogin}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;
