import React from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import TabledPage from '../wrappers/TabledPageParent';

import config from '../../config/config';

const columns = [
    {
        dataField: 'id',
        text: 'ID',
        sort: true
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
    }
];

const defaultSorted = [{
    dataField: 'username',
    order: 'asc'
}];

class AllUsers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    formatResult = data => {
        return data.map(d => ({
            id: d.id,
            username: d.username,
            email: d.email
        }));
    }

    render() {
        return (
            <BootstrapTable hover striped condensed
                keyField='id'
                data={this.formatResult(this.props.data)}
                columns={columns}
                filter={filterFactory()}
                defaultSorted={defaultSorted}
                onTableChange={this.props.onTableChange}
            />
        );
    }
}

export default TabledPage({
    getAll: config.uris.usersUri.getAllWOrderUri,
    getCount: config.uris.usersUri.countUri,
})(AllUsers);