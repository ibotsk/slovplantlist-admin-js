import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  Grid,
  Tabs, Tab,
} from 'react-bootstrap';

import LoggedUserType from 'components/propTypes/loggedUser';

import Can from 'components/segments/auth/Can';

import AllUsers from './Tabs/AllUsers';
import GeneraUsers from './Tabs/GeneraUsers';

class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTabKey: 1,
      // showModalUser: false,
      // editId: undefined,
    };
  }

  render() {
    const { user } = this.props;
    const { activeTabKey } = this.state;
    return (
      <Can
        role={user.role}
        perform="users"
        yes={() => (
          <div id="users">
            <Grid id="page-heading">
              <h2>Manage users</h2>
            </Grid>
            <Grid>
              <Tabs
                activeKey={activeTabKey}
                onSelect={(key) => this.setState({ activeTabKey: key })}
                id="users-tabs"
              >
                <Tab eventKey={1} title="All users">
                  <AllUsers />
                </Tab>
                <Tab eventKey={2} title="Users and genera">
                  <GeneraUsers />
                </Tab>
              </Tabs>
            </Grid>
          </div>
        )}
        no={() => <Redirect to="/" />}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Users);

Users.propTypes = {
  user: LoggedUserType.type.isRequired,
};
