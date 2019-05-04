import React from 'react';
import { connect } from 'react-redux';

import {
    Grid, Button, Glyphicon,
    Tabs, Tab
} from 'react-bootstrap';

import AllUsers from './AllUsers';
import UsersModal from '../segments/modals/UsersModal';
import TabledPage from '../wrappers/TabledPageParent';

import config from '../../config/config';

class Users extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTabKey: 1,
            showModalUser: false,
            editId: undefined
        };
    }

    showModal = id => {
        this.setState({
            showModalUser: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, {
            page: this.props.paginationOptions.page,
            sizePerPage: this.props.paginationOptions.sizePerPage,
            filters: {},
            sortField: 'username',
            sortOrder: 'asc'
        });
        this.setState({ showModalUser: false });
    }

    render() {
        return (
            <div id='users'>
                <Grid id='functions-panel'>
                    <div id="functions">
                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                    </div>
                    <h2>Manage users</h2>
                </Grid>
                <Grid>
                    <Tabs
                        activeKey={this.state.activeTabKey}
                        onSelect={key => this.setState({ activeTabKey: key })}
                        id="users-tabs"
                    >
                        <Tab eventKey={1} title="All users">
                            <AllUsers
                                data={this.props.data}
                                accessToken={this.props.accessToken}
                                onEditAction={this.showModal}
                            />
                        </Tab>
                        <Tab eventKey={2} title="Create new">
                            Tab 2 content
                    </Tab>
                    </Tabs>
                </Grid>
                <UsersModal id={this.state.editId} show={this.state.showModalUser} onHide={this.hideModal} />
            </div>
        );
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(
    TabledPage({
        getAll: config.uris.usersUri.getAllWOrderUri,
        getCount: config.uris.usersUri.countUri,
    })(Users)
);