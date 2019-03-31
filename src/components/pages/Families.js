import React from 'react';

import { Grid } from 'react-bootstrap';

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
        dataField: 'name',
        text: 'Name',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'vernacular',
        text: 'Vernacular',
        filter: textFilter(),
        sort: true
    }
];

const formatResult = data => {
    return data.map(d => ({
        id: d.id,
        name: d.name,
        vernacular: d.vernacular
    }));
}

const Families = ({ data, onTableChange }) => {

    return (
        <div id='families'>
            <Grid id='functions-panel'>
                <h2>Families</h2>
                <p>All filters are case sensitive</p>
            </Grid>
            <Grid fluid={true}>
                <BootstrapTable hover striped condensed
                    keyField='id'
                    data={formatResult(data)}
                    columns={columns}
                    filter={filterFactory()}
                    onTableChange={onTableChange}
                />
            </Grid>
        </div>
    );
}

export default TabledPage({
    getAll: config.uris.familiesUri.getAllWOrderUri,
    getCount: config.uris.familiesUri.countUri,
})(Families);
