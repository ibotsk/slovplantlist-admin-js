import React from 'react';

import { Grid } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import LosName from '../segments/LosName';
import TabledPage from '../wrappers/TabledPageParent';

import config from '../../config/config';

const PAGE_DETAIL = "/checklist/detail/";

const columns = [
    {
        dataField: 'id',
        text: 'ID'
    },
    {
        dataField: 'type',
        text: 'Type'
    },
    {
        dataField: 'name',
        text: 'Name'
    },
    {
        dataField: 'publication',
        text: 'Publication'
    },
    {
        dataField: 'acceptedName',
        text: 'Accepted name'
    }];

const formatResult = data => {
    return data.map(d => ({
        id: d.id,
        type: d.ntype,
        name: <a href={`${PAGE_DETAIL}${d.id}`} ><LosName key={d.id} nomen={d} format='plain' /></a>,
        publication: d.publication,
        acceptedName: <a href={d.accepted ? `${PAGE_DETAIL}${d.accepted.id}` : ""}><LosName key={`acc${d.id}`} nomen={d.accepted} format='plain' /></a>
    }));
}

const Checklist = ({ data, paginationOptions, onTableChange }) => {

    return (
        <div id='checklist'>
            <Grid id='functions-panel'>
                <h2>Checklist</h2>
            </Grid>
            <Grid fluid={true}>
                <BootstrapTable hover striped condensed
                    remote={{ filter: true, pagination: true }}
                    keyField='id'
                    data={formatResult(data)}
                    columns={columns}
                    filter={filterFactory()}
                    onTableChange={onTableChange}
                    pagination={paginationFactory(paginationOptions)}
                />
            </Grid>
        </div>
    )

}

export default TabledPage({
    getAll: config.uris.nomenclaturesUri.getAll,
    getCount: config.uris.nomenclaturesUri.count
})(Checklist);