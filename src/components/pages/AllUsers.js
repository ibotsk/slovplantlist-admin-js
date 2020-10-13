import React from 'react';
import { connect } from 'react-redux';

import {
    Button, Glyphicon, Panel
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import TabledPage from '../wrappers/TabledPageParent';
import UsersModal from '../segments/modals/UsersModal';

import formatter from '../../utils/formatter';
import config from '../../config/config';

const columns = [
    {
        dataField: 'id',
        text: 'ID',
        sort: true
    },
    {
        dataField: 'action',
        text: 'Action'
    },
    {
        dataField: 'username',
        text: 'User Name',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'email',
        text: 'Email',
        sort: true
    },
    {
        dataField: 'roles',
        text: 'Role'
    }
];

const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
}];

class AllUsers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModalUser: false,
            editId: undefined
        };
    }

    formatResult = (data) => {
        return data.map(u => ({
            id: u.id,
            action: <Button bsSize='xsmall' bsStyle="warning" onClick={() => this.showModal(u.id)}>Edit</Button>,
            username: u.username,
            email: u.email,
            roles: formatter.userRole(u.roles)
        }));
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
            <div id="all-users">
                <Panel id="functions">
                    <Panel.Body>
                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new user</Button>
                    </Panel.Body>
                </Panel>
                <BootstrapTable hover striped condensed
                    keyField='id'
                    data={this.formatResult(this.props.data)}
                    columns={columns}
                    filter={filterFactory()}
                    defaultSorted={defaultSorted}
                    onTableChange={this.props.onTableChange}
                />
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
    })(AllUsers)
);