import React, { Component } from 'react';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import tablesService from '../../services/tables';

import helper from '../../utils/helper';
import filtershelper from '../../utils/filters';
import config from '../../config/config';

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
        Showing {from} to {to} of {size} Results
    </span>
);
const paginationOptions = config.pagination;
paginationOptions.paginationTotalRenderer = customTotal;

const TabledPage = injectedProps => WrappedComponent => {

    return class extends Component {

        constructor(props) {
            super(props);

            this.accessToken = this.props.accessToken;

            this.state = {
                records: [],
                totalSize: 0,
                page: 1,
                sizePerPage: paginationOptions.sizePerPageList[0].value,
                filters: {},
                sortField: 'id',
                sortOrder: 'asc'
            }
        }

        handleTableChange = async (type, { page, sizePerPage, filters, sortField, sortOrder }) => {
            const ownerId = this.props.user ? this.props.user.id : undefined;

            const curatedFilters = filtershelper.curateSearchFilters(filters, { ownerId });
            const where = helper.makeWhere(curatedFilters); //TODO make function to take into account existing where

            const curatedSortField = filtershelper.curateSortFields(sortField);
            const order = helper.makeOrder(curatedSortField, sortOrder);

            const totalSize = await this.fetchCount(where);
            const offset = (page - 1) * sizePerPage;
            const records = await this.fetchRecords(where, order, offset, sizePerPage);
            this.setState({
                records,
                sizePerPage,
                page,
                where,
                totalSize,
                filters,
                sortField,
                sortOrder
            });
        }

        fetchRecords = async (where, order, offset, limit) => {
            return await tablesService.getAll(injectedProps.getAll, offset, where, order, limit, this.accessToken);
        }

        fetchCount = async where => {
            const whereString = JSON.stringify(where);
            const countResponse = await tablesService.getCount(injectedProps.getCount, whereString, this.accessToken);
            return countResponse.count;
        }

        // must be will mount because this must be the first thing to be called, before handleTableChange in case of remote tables
        componentWillMount() {
            this.handleTableChange(undefined, {
                page: this.state.page,
                sizePerPage: paginationOptions.sizePerPageList[0].value,
                filters: this.state.filters,
                sortField: this.state.sortField,
                sortOrder: this.state.sortOrder
            });
        }

        render() {
            const { page, sizePerPage, totalSize, filters, sortField, sortOrder } = this.state;
            const allPaginationOptions = { ...paginationOptions, page, sizePerPage, totalSize };
            const sorting = { sortField, sortOrder };
            return (
                <WrappedComponent
                    {...this.props}
                    onTableChange={this.handleTableChange}
                    paginationOptions={allPaginationOptions}
                    filters={filters}
                    sorting={sorting}
                    data={this.state.records}
                />
            );
        }

    }

}

export default TabledPage;