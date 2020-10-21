import React from 'react';
import { connect } from 'react-redux';

import {
  Grid, Button, Glyphicon,
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';
import FamilyType from 'components/propTypes/family';

import TabledPage from 'components/wrappers/TabledPageParent';
import Can from 'components/segments/auth/Can';

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
    const { onTableChange, paginationOptions } = this.props;
    onTableChange(undefined, {
      page: paginationOptions.page,
      sizePerPage: paginationOptions.sizePerPage,
      filters: {},
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
    const { user, data, onTableChange } = this.props;
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
          <BootstrapTable
            hover
            striped
            condensed
            keyField="id"
            data={this.formatResult(data)}
            columns={columns}
            defaultSorted={defaultSorted}
            filter={filterFactory()}
            onTableChange={onTableChange}
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
    getAll: config.uris.familiesUri.getAllWOrderUri,
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
};
