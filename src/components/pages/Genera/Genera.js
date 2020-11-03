import React from 'react';
import { connect } from 'react-redux';

import {
  Grid, Button, Glyphicon,
} from 'react-bootstrap';

import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';
import GenusType from 'components/propTypes/genus';

import TabledPage from 'components/wrappers/TabledPageParent';
import RemotePagination from 'components/segments/RemotePagination';
import Can from 'components/segments/auth/Can';

import config from 'config/config';

import GeneraModal from './Modals/GeneraModal';

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
    filter: textFilter({ caseSensitive: true }),
    sort: true,
  },
  {
    dataField: 'authors',
    text: 'Authors',
    filter: textFilter({ caseSensitive: true }),
    sort: true,
  },
  {
    dataField: 'vernacular',
    text: 'Vernacular',
    filter: textFilter({ caseSensitive: true }),
    sort: true,
  },
  {
    dataField: 'familyApg',
    text: 'Family APG',
  },
  {
    dataField: 'family',
    text: 'Family',
  },
];

const defaultSorted = [{
  dataField: 'name',
  order: 'asc',
}];

class Genera extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModalGenera: false,
      editId: 0,
    };
  }

  showModal = (id) => {
    this.setState({
      showModalGenera: true,
      editId: id,
    });
  }

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
    this.setState({ showModalGenera: false });
  }

  formatResult = (data) => data.map((g) => {
    const { user } = this.props;
    return {
      id: g.id,
      action: (
        <Can
          role={user.role}
          perform="genus:edit"
          yes={() => (
            <Button
              bsSize="xsmall"
              bsStyle="warning"
              onClick={() => this.showModal(g.id)}
            >
              Edit
            </Button>
          )}
        />),
      name: g.name,
      authors: g.authors,
      vernacular: g.vernacular,
      familyApg: g['family-apg'] ? g['family-apg'].name : '',
      family: g.family ? g.family.name : '',
    };
  })

  render() {
    const {
      user, data, onTableChange, paginationOptions,
    } = this.props;
    const { editId, showModalGenera } = this.state;
    return (
      <div id="genera">
        <Grid id="functions-panel">
          <div id="functions">
            <Can
              role={user.role}
              perform="genus:edit"
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
          <h2>Genera</h2>
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
        <GeneraModal
          id={editId}
          show={showModalGenera}
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
    getAll: config.uris.generaUri.getAllWFilterUri,
    getCount: config.uris.generaUri.countUri,
  })(Genera),
);

Genera.propTypes = {
  user: LoggedUserType.type.isRequired,
  data: PropTypes.arrayOf(GenusType.type).isRequired,
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

Genera.defaultProps = {
  filters: undefined,
  sorting: undefined,
};
