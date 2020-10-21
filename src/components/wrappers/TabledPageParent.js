import React, { Component } from 'react';
import { connect } from 'react-redux';

// eslint-disable-next-line max-len
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import PropTypes from 'prop-types';

import LoggedUserType from 'components/propTypes/loggedUser';

import { tablesFacade } from 'facades';

import { helperUtils, filterUtils } from 'utils';
import config from 'config/config';

const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    Showing
    {' '}
    {from}
    {' '}
    to
    {' '}
    {to}
    {' '}
    of
    {' '}
    {size}
    {' '}
    Results
  </span>
);
const paginationOptions = config.pagination;
paginationOptions.paginationTotalRenderer = customTotal;

const TabledPage = (injectedProps) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (WrappedComponent) => {
    const hoc = class extends Component {
      constructor(props) {
        super(props);

        this.state = {
          records: [],
          totalSize: 0,
          page: 1,
          sizePerPage: paginationOptions.sizePerPageList[0].value,
          filters: {},
          sortField: 'id',
          sortOrder: 'asc',
        };
      }

      componentDidMount() {
        const {
          page, filters, sortField, sortOrder,
        } = this.state;

        this.handleTableChange(undefined, {
          page,
          sizePerPage: paginationOptions.sizePerPageList[0].value,
          filters,
          sortField,
          sortOrder,
        });
      }

      handleTableChange = async (type, {
        page, sizePerPage, filters, sortField, sortOrder,
      }) => {
        const { user } = this.props;
        const ownerId = user ? user.id : undefined;

        const curatedFilters = filterUtils.curateSearchFilters(
          filters, { ownerId },
        );
        const where = helperUtils.makeWhere(curatedFilters); // TODO make function to take into account existing where

        const curatedSortField = filterUtils.curateSortFields(sortField);
        const order = helperUtils.makeOrder(curatedSortField, sortOrder);

        const totalSize = await this.fetchCount(where);
        const offset = (page - 1) * sizePerPage;
        const records = await this.fetchRecords(
          where, order, offset, sizePerPage,
        );
        this.setState({
          records,
          sizePerPage,
          page,
          totalSize,
          filters,
          sortField,
          sortOrder,
        });
      }

      fetchRecords = async (where, order, offset, limit) => {
        const { accessToken } = this.props;
        return tablesFacade.getAll(
          injectedProps.getAll,
          offset,
          where,
          order,
          limit,
          accessToken,
        );
      }

      fetchCount = async (where) => {
        const { accessToken } = this.props;
        const whereString = JSON.stringify(where);
        const countResponse = await tablesFacade.getCount(
          injectedProps.getCount, whereString, accessToken,
        );
        return countResponse.count;
      }

      render() {
        const {
          records,
          page, sizePerPage, totalSize, filters, sortField, sortOrder,
        } = this.state;
        const allPaginationOptions = {
          ...paginationOptions, page, sizePerPage, totalSize,
        };
        const sorting = { sortField, sortOrder };
        return (
          <WrappedComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...this.props}
            onTableChange={this.handleTableChange}
            paginationOptions={allPaginationOptions}
            filters={filters}
            sorting={sorting}
            data={records}
          />
        );
      }
    };

    hoc.propTypes = {
      user: LoggedUserType.type,
      accessToken: PropTypes.string.isRequired,
    };

    hoc.defaultProps = {
      user: undefined,
    };

    const mapStateToProps = (state) => ({
      accessToken: state.authentication.accessToken,
    });

    return connect(mapStateToProps)(hoc);
  };

export default TabledPage;
