import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { Switch } from 'react-router-dom';

import Footer from '../segments/Footer';
import CNavbar from '../segments/Navbar';

import Checklist from './Checklist';
import SpeciesRecord from './SpeciesRecord';
import Genera from './Genera';
import FamiliesAPG from './FamiliesAPG';
import Families from './Families';
import Logout from '../segments/Logout';

import PrivateRoute from '../wrappers/PrivateRoute';

const Routing = () => (
    <Switch>
        <PrivateRoute exact path="/checklist" component={Checklist} />
        <PrivateRoute path="/checklist/detail/:id" component={SpeciesRecord} />
        <PrivateRoute path="/checklist/edit/:id" component={SpeciesRecord} />
        <PrivateRoute path="/checklist/new" component={SpeciesRecord} />
        <PrivateRoute exact path="/genera" component={Genera} />
        <PrivateRoute exact path="/families-apg" component={FamiliesAPG} />
        <PrivateRoute exact path="/families" component={Families} />
        <PrivateRoute exact path='/logout' component={Logout} />
    </Switch>
);

const HomePage = () => (
    <React.Fragment>
        <CNavbar />
        <Routing />
        <Footer />
        <NotificationContainer />
    </React.Fragment>
);

export default HomePage;