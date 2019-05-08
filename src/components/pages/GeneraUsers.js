import React from 'react';
import { connect } from 'react-redux';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import TabledPage from '../wrappers/TabledPageParent';

import config from '../../config/config';
import GeneraList from '../segments/GeneraList';

const columns = [
    {
        dataField: 'id',
        text: 'ID'
    },
    {
        dataField: 'username',
        text: 'User Name',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'genera',
        text: 'Assigned Genera'
    }
];

const defaultSorted = [{
    dataField: 'username',
    order: 'asc'
}];

class GeneraUsers extends React.Component {

    formatResult = (data) => {
        return data.map(u => ({
            id: u.id,
            username: u.username,
            genera: <GeneraList key={u.id} data={u.genera} />
        }));
    }

    render() {
        return (
            <div>
                <BootstrapTable hover striped condensed
                    keyField='id'
                    data={this.formatResult(this.props.data)}
                    columns={columns}
                    filter={filterFactory()}
                    defaultSorted={defaultSorted}
                    onTableChange={this.props.onTableChange}
                />
            </div>
        );
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(
    TabledPage({
        getAll: config.uris.usersUri.getAllWGeneraUri,
        getCount: config.uris.usersUri.countUri,
    })(GeneraUsers)
);