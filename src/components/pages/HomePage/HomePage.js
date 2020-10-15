import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { Switch } from 'react-router-dom';

import Footer from './Footer';
import CNavbar from './Navbar/Navbar';

import Checklist from '../Checklist/Checklist';
import SpeciesRecord from '../SpeciesRecord/SpeciesRecord';
import Genera from '../Genera/Genera';
import FamiliesAPG from '../FamiliesAPG/FamiliesAPG';
import Families from '../Families/Families';
import Users from '../Users/Users';
import Logout from './Logout';

import PrivateRoute from '../../wrappers/PrivateRoute';

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
