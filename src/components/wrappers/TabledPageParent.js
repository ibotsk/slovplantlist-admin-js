import React, { Component } from 'react';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import tablesService from '../../services/tables';

import helper from '../../utils/helper';
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

            this.state = {
                records: [],
                totalSize: 0,
                page: 1,
                sizePerPage: paginationOptions.sizePerPageList[0].value,
                where: {},
                order: ['id']
            }
        }

        handleTableChange = async (type, { page, sizePerPage, filters, sortField, sortOrder }) => {
            const curatedFilters = helper.curateSearchFilters(filters);
            const curatedSortField = helper.curateSortFields(sortField);
            const where = helper.makeWhere(curatedFilters); //TODO make function to take into account existing where
            const order = helper.makeOrder(curatedSortField, sortOrder);
            await this.handleChange(page, sizePerPage, where, order);
        }

        handleChange = async (page, sizePerPage, where, order) => {
            const totalSize = await this.fetchCount(where);
            const offset = (page - 1) * sizePerPage;
            const records = await this.fetchRecords(where, order, offset, sizePerPage);
            this.setState({
                records,
                sizePerPage,
                page,
                where,
                order,
                totalSize
            });
        }

        fetchRecords = async (where, order, offset, limit) => {
            const accessToken = this.props.accessToken;
            return await tablesService.getAll(injectedProps.getAll, offset, where, order, limit, accessToken);
        }

        fetchCount = async where => {
            const accessToken = this.props.accessToken;
            const whereString = JSON.stringify(where);
            const countResponse = await tablesService.getCount(injectedProps.getCount, whereString, accessToken);
            return countResponse.count;
        }

        componentDidMount() {
            this.handleChange(this.state.page, paginationOptions.sizePerPageList[0].value, this.state.where, this.state.order);
        }

        render() {
            const { page, sizePerPage, totalSize } = this.state;
            const allPaginationOptions = { ...paginationOptions, page, sizePerPage, totalSize };
            return (
                <WrappedComponent
                    {...this.props}
                    onTableChange={this.handleTableChange}
                    paginationOptions={allPaginationOptions}
                    data={this.state.records}
                />
            );
        }

    }

}

export default TabledPage;