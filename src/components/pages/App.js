import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from 'components/wrappers/PrivateRoute';

import Login from './Login';
import HomePage from './HomePage/HomePage';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <PrivateRoute component={HomePage} />
    </Switch>
  </BrowserRouter>
);

export default App;
