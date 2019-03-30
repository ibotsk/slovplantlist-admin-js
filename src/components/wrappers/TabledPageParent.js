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
                where: {}
            }
        }

        handleTableChange = async (type, { page = this.state.page, sizePerPage = this.state.sizePerPage, filters = {} }) => {
            const where = helper.makeWhere(filters); //TODO make function to take into account existing where
            await this.handleChange(page, sizePerPage, where);
        }

        handleChange = async (page, sizePerPage, where) => {
            await this.fetchCount(where);
            const offset = (page - 1) * sizePerPage;
            const records = await this.fetchRecords(where, offset, sizePerPage);
            this.setState({
                records,
                sizePerPage,
                page,
                where
            });
        }

        fetchRecords = async (where, offset, limit) => {
            const accessToken = this.props.accessToken;
            return await tablesService.getAll(injectedProps.getAll, offset, where, limit, accessToken);
        }

        fetchCount = async where => {
            const accessToken = this.props.accessToken;
            const whereString = JSON.stringify(where);
            const countResponse = await tablesService.getCount(injectedProps.getCount, whereString, accessToken);
            this.setState({
                totalSize: countResponse.count
            });
        }

        componentDidMount() {
            this.handleChange(this.state.page, paginationOptions.sizePerPageList[0].value, this.state.where);
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