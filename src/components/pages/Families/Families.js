import React from 'react';
import { connect } from 'react-redux';

import {
  Grid, Button, Glyphicon,
} from 'react-bootstrap';

import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';
import FamilyType from 'components/propTypes/family';

import TabledPage from 'components/wrappers/TabledPageParent';
import Can from 'components/segments/auth/Can';
import RemotePagination from 'components/segments/RemotePagination';

import config from 'config/config';

import FamiliesModal from './Modals/FamiliesModal';

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
  },
  {
    dataField: 'action',
    text: 'Actions',
  },
  {
    dataField: 'name',
    text: 'Name',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'vernacular',
    text: 'Vernacular',
    filter: textFilter(),
    sort: true,
  },
];

const defaultSorted = [{
  dataField: 'name',
  order: 'asc',
}];

class Families extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModalFamily: false,
      editId: 0,
    };
  }

  showModal = (id) => {
    this.setState({
      showModalFamily: true,
      editId: id,
    });
  };

  hideModal = () => {
    const {
      onTableChange, paginationOptions, filters, sorting,
    } = this.props;
    const { sortField, sortOrder } = sorting || {};
    const { page, sizePerPage } = paginationOptions || {};

    onTableChange(undefined, {
      page,
      sizePerPage,
      filters,
      sortField,
      sortOrder,
    });
    this.setState({ showModalFamily: false });
  };

  formatResult = (data) => data.map((d) => {
    const { user } = this.props;
    return {
      id: d.id,
      action: (
        <Can
          role={user.role}
          perform="family:edit"
          yes={() => (
            <Button
              bsSize="xsmall"
              bsStyle="warning"
              onClick={() => this.showModal(d.id)}
            >
              Edit
            </Button>
          )}
        />
      ),
      name: d.name,
      vernacular: d.vernacular,
    };
  });

  render() {
    const {
      user, data, onTableChange, paginationOptions,
    } = this.props;
    const { editId, showModalFamily } = this.state;
    return (
      <div id="families">
        <Grid id="functions-panel">
          <div id="functions">
            <Can
              role={user.role}
              perform="family:edit"
              yes={() => (
                <Button bsStyle="success" onClick={() => this.showModal('')}>
                  <Glyphicon glyph="plus" />
                  {' '}
                  Add new
                </Button>
              )}
            />
          </div>
        </Grid>
        <hr />
        <Grid>
          <h2>Families</h2>
          <p>All filters are case sensitive</p>
        </Grid>
        <Grid fluid>
          <RemotePagination
            hover
            striped
            condensed
            remote
            keyField="id"
            data={this.formatResult(data)}
            columns={columns}
            defaultSorted={defaultSorted}
            filter={filterFactory()}
            onTableChange={onTableChange}
            paginationOptions={paginationOptions}
          />
        </Grid>
        <FamiliesModal
          id={editId}
          show={showModalFamily}
          onHide={this.hideModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
  user: state.user,
});

export default connect(mapStateToProps)(
  TabledPage({
    getAll: config.uris.familiesUri.getAllWFilterUri,
    getCount: config.uris.familiesUri.countUri,
  })(Families),
);

Families.propTypes = {
  user: LoggedUserType.type.isRequired,
  data: PropTypes.arrayOf(FamilyType.type).isRequired,
  onTableChange: PropTypes.func.isRequired,
  paginationOptions: PropTypes.shape({
    page: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
  }).isRequired,
  filters: PropTypes.objectOf(PropTypes.shape({
    caseSensitive: PropTypes.bool.isRequired,
    comparator: PropTypes.string.isRequired,
    filterType: PropTypes.string.isRequired,
    filterVal: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]).isRequired,
  })),
  sorting: PropTypes.shape({
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
  }),
};

Families.defaultProps = {
  filters: undefined,
  sorting: undefined,
};
