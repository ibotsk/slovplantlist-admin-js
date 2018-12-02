import React, { Component } from 'react';
import CNavbar from '../segments/Navbar';
import Checklist from './Checklist';
import LosDetail from './LosDetail';
import Genera from './Genera';

import { Route, Switch } from 'react-router-dom';
import FamiliesAPG from './FamiliesAPG';
import Families from './Families';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/checklist" component={Checklist} />
      <Route path="/checklist/detail/:id" component={LosDetail} />
      <Route exact path="/genera" component={Genera} />
      <Route exact path="/families-apg" component={FamiliesAPG} />
      <Route exact path="/families" component={Families} />
    </Switch>
  );
}

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CNavbar />
        <Routing />
      </React.Fragment>
    );
  }
}

export default App;
