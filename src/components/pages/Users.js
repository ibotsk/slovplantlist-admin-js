import React from 'react';
import { connect } from 'react-redux';

import {
    Grid,
    Tabs, Tab
} from 'react-bootstrap';

import AllUsers from './AllUsers';

class Users extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            key: 1
        };
    }

    render() {
        return (
            <Grid>
                <h2>Manage users</h2>
                <Tabs
                    activeKey={this.state.key}
                    onSelect={key => this.setState({ key })}
                    id="users-tabs"
                >
                    <Tab eventKey={1} title="All users">
                        <AllUsers accessToken={this.props.accessToken} />
                    </Tab>
                    <Tab eventKey={2} title="Create new">
                        Tab 2 content
                    </Tab>
                </Tabs>
            </Grid>
        );
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(Users);