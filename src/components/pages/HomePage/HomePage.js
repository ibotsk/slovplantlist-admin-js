import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { Switch } from 'react-router-dom';

import Users from 'components/pages/Users/Users';
import Checklist from 'components/pages/Checklist/Checklist';
import SpeciesRecord from 'components/pages/SpeciesRecord/SpeciesRecord';
import Genera from 'components/pages/Genera/Genera';
import FamiliesAPG from 'components/pages/FamiliesAPG/FamiliesAPG';
import Families from 'components/pages/Families/Families';

import PrivateRoute from 'components/wrappers/PrivateRoute';

import Footer from './Footer';
import CNavbar from './Navbar/Navbar';
import Logout from './Logout';

const Routing = () => (
  <Switch>
    <PrivateRoute exact path="/checklist" component={Checklist} />
    <PrivateRoute path="/checklist/detail/:id" component={SpeciesRecord} />
    <PrivateRoute path="/checklist/edit/:id" component={SpeciesRecord} />
    <PrivateRoute path="/checklist/new" component={SpeciesRecord} />
    <PrivateRoute exact path="/genera" component={Genera} />
    <PrivateRoute exact path="/families-apg" component={FamiliesAPG} />
    <PrivateRoute exact path="/families" component={Families} />
    <PrivateRoute exact path="/users" component={Users} />
    <PrivateRoute exact path="/logout" component={Logout} />
  </Switch>
);

const HomePage = () => (
  <>
    <CNavbar />
    <Routing />
    <Footer />
    <NotificationContainer />
  </>
);

export default HomePage;
