import React from 'react';
import { connect } from 'react-redux';

import {
  Button, Glyphicon, Panel,
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import UserType from 'components/propTypes/user';

import TabledPage from 'components/wrappers/TabledPageParent';

import { formatterUtils } from 'utils';
import config from 'config/config';

import UsersModal from './Modals/UsersModal';

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
  },
  {
    dataField: 'action',
    text: 'Action',
  },
  {
    dataField: 'username',
    text: 'User Name',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'email',
    text: 'Email',
    sort: true,
  },
  {
    dataField: 'roles',
    text: 'Role',
  },
];

const defaultSorted = [{
  dataField: 'id',
  order: 'asc',
}];

class AllUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModalUser: false,
      editId: undefined,
    };
  }

  formatResult = (data) => data.map((u) => ({
    id: u.id,
    action: (
      <Button
        bsSize="xsmall"
        bsStyle="warning"
        onClick={() => this.showModal(u.id)}
      >
        Edit
      </Button>
    ),
    username: u.username,
    email: u.email,
    roles: formatterUtils.userRole(u.roles),
  }))

  showModal = (id) => {
    this.setState({
      showModalUser: true,
      editId: id,
    });
  }

  hideModal = () => {
    const { onTableChange, paginationOptions } = this.props;
    onTableChange(undefined, {
      page: paginationOptions.page,
      sizePerPage: paginationOptions.sizePerPage,
      filters: {},
      sortField: 'username',
      sortOrder: 'asc',
    });
    this.setState({ showModalUser: false });
  }

  render() {
    const { data, onTableChange } = this.props;
    const { editId, showModalUser } = this.state;

    return (
      <div id="all-users">
        <Panel id="functions">
          <Panel.Body>
            <Button bsStyle="success" onClick={() => this.showModal('')}>
              <Glyphicon glyph="plus" />
              {' '}
              Add new user
            </Button>
          </Panel.Body>
        </Panel>
        <BootstrapTable
          hover
          striped
          condensed
          keyField="id"
          data={this.formatResult(data)}
          columns={columns}
          filter={filterFactory()}
          defaultSorted={defaultSorted}
          onTableChange={onTableChange}
        />
        <UsersModal id={editId} show={showModalUser} onHide={this.hideModal} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(
  TabledPage({
    getAll: config.uris.usersUri.getAllWOrderUri,
    getCount: config.uris.usersUri.countUri,
  })(AllUsers),
);

AllUsers.propTypes = {
  data: PropTypes.arrayOf(UserType.type).isRequired,
  onTableChange: PropTypes.func.isRequired,
  paginationOptions: PropTypes.shape({
    page: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
  }).isRequired,
};
