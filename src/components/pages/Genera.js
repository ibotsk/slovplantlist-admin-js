import React from 'react';

import { Grid } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

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
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'authors',
        text: 'Authors',
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'vernacular',
        text: 'Vernacular',
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'familyAPG',
        text: 'Family APG'
    },
    {
        dataField: 'family',
        text: 'Family'
    },
];

const defaultSorted = [{
    dataField: 'name',
    order: 'asc'
}];

const formatResult = data => {
    return data.map(d => ({
        id: d.id,
        name: d.name,
        authors: d.authors,
        vernacular: d.vernacular,
        familyAPG: d.familyApg ? d.familyApg.name : "",
        family: d.family ? d.family.name : ""
    }));
}

const Genera = ({ data, paginationOptions, onTableChange }) => {

    return (
        <div id='genera'>
            <Grid id='functions-panel'>
                <h2>Genera</h2>
                <p>All filters are case sensitive</p>
            </Grid>
            <Grid fluid={true}>
                <BootstrapTable hover striped condensed
                    remote={{ filter: true, pagination: true }}
                    keyField='id'
                    data={formatResult(data)}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    filter={filterFactory()}
                    onTableChange={onTableChange}
                    pagination={paginationFactory(paginationOptions)}
                />
            </Grid>
        </div>
    );

}

export default TabledPage({
    getAll: config.uris.generaUri.getAllWFilterUri,
    getCount: config.uris.generaUri.countUri,
})(Genera);
