import React from 'react';
import { connect } from 'react-redux';

import {
  Button, Glyphicon, Panel,
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';

import config from 'config/config';
import { formatterUtils } from 'utils';

import commonHooks from 'components/segments/hooks';

import UsersModal from './Modals/UsersModal';

const getAllUri = config.uris.usersUri.getAllWOrderUri;
const getCountUri = config.uris.usersUri.countUri;

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

const AllUsers = ({ accessToken }) => {
  const {
    showModal, editId,
    handleShowModal, handleHideModal,
  } = commonHooks.useModal();

  const {
    where, order, setValues,
  } = commonHooks.useTableChange();

  const { data } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, 1,
    undefined, order, showModal,
  );

  const formatResult = (records) => records.map((u) => ({
    id: u.id,
    action: (
      <Button
        bsSize="xsmall"
        bsStyle="warning"
        onClick={() => handleShowModal(u.id)}
      >
        Edit
      </Button>
    ),
    username: u.username,
    email: u.email,
    roles: formatterUtils.userRole(u.roles),
  }));

  const onTableChange = (type, {
    filters,
    sortField,
    sortOrder,
  }) => (
    setValues({
      filters,
      sortField,
      sortOrder,
    })
  );

  return (
    <div id="all-users">
      <Panel id="functions">
        <Panel.Body>
          <Button bsStyle="success" onClick={() => handleShowModal(undefined)}>
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
        data={formatResult(data)}
        columns={columns}
        filter={filterFactory()}
        defaultSorted={defaultSorted}
        onTableChange={onTableChange}
      />
      <UsersModal
        id={editId}
        show={showModal}
        onHide={() => handleHideModal()}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(AllUsers);

AllUsers.propTypes = {
  accessToken: PropTypes.string.isRequired,
};
