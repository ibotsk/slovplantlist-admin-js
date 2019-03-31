import React from 'react';

import { Grid } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, multiSelectFilter, Comparator } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import LosName from '../segments/LosName';
import TabledPage from '../wrappers/TabledPageParent';

import config from '../../config/config';
import helper from '../../utils/helper';

const PAGE_DETAIL = "/checklist/detail/";

const listOfSpeciesColumn = config.constants.listOfSpeciesColumn;
const ntypesOptions = helper.buildOptionsFromKeys(config.mappings.losType);

const columns = [
    {
        dataField: 'id',
        text: 'ID',
        sort: true
    },
    {
        dataField: 'ntype',
        text: 'Type',
        filter: multiSelectFilter({
            options: ntypesOptions,
            comparator: Comparator.EQ
        }),
        sort: true
    },
    {
        dataField: listOfSpeciesColumn,
        text: 'Name',
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'publication',
        text: 'Publication',
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'acceptedName',
        text: 'Accepted name'
    }];

const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
}];

const formatResult = data => {
    return data.map(d => ({
        id: d.id,
        ntype: d.ntype,
        [listOfSpeciesColumn]: <a href={`${PAGE_DETAIL}${d.id}`} ><LosName key={d.id} nomen={d} format='plain' /></a>,
        publication: d.publication,
        acceptedName: <a href={d.accepted ? `${PAGE_DETAIL}${d.accepted.id}` : ""}><LosName key={`acc${d.id}`} nomen={d.accepted} format='plain' /></a>
    }));
}

const Checklist = ({ data, paginationOptions, onTableChange }) => {

    return (
        <div id='checklist'>
            <Grid id='functions-panel'>
                <h2>Checklist</h2>
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
    getAll: config.uris.nomenclaturesUri.getAllWFilter,
    getCount: config.uris.nomenclaturesUri.countUri
})(Checklist);