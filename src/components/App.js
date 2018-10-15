import React, { Component } from 'react';
import CNavbar from './Navbar';
import Checklist from "./Checklist";

import { Route, Switch } from 'react-router-dom';
import { Grid } from 'react-bootstrap';


const Routing = () => {
  return (
      <Switch>
          <Route path="/checklist" component={Checklist} />
      </Switch>
  );
}

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CNavbar />
        <Grid fluid={true}>
          <Routing />
        </Grid>
      </React.Fragment>
    );
  }
}

export default App;
