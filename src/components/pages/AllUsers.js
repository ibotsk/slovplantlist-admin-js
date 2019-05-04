import React from 'react';

import {
    Button
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import formatter from '../../utils/formatter';

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
    dataField: 'username',
    order: 'asc'
}];

const formatResult = (props) => {
    return props.data.map(u => ({
        id: u.id,
        action: <Button bsSize='xsmall' bsStyle="warning" onClick={() => props.onEditAction(u.id)}>Edit</Button>,
        username: u.username,
        email: u.email,
        roles: formatter.userRole(u.roles)
    }));
}

const AllUsers = (props) => {
    return (
        <BootstrapTable hover striped condensed
            keyField='id'
            data={formatResult(props)}
            columns={columns}
            filter={filterFactory()}
            defaultSorted={defaultSorted}
            onTableChange={props.onTableChange}
        />
    );
}

export default AllUsers;