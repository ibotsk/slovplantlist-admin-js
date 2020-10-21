import React from 'react';
import { connect } from 'react-redux';

import {
  Button, Glyphicon,
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import UserType from 'components/propTypes/user';

import TabledPage from 'components/wrappers/TabledPageParent';
import GeneraList from 'components/segments/GeneraList';

import config from 'config/config';

import UsersGeneraModal from './Modals/UsersGeneraModal';

const columns = [
  {
    dataField: 'id',
    text: 'ID',
  },
  {
    dataField: 'username',
    text: 'User Name',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'genera',
    text: 'Assigned Genera',
  },
];

const defaultSorted = [{
  dataField: 'username',
  order: 'asc',
}];

const GenusButtonAddEdit = ({ onClick }) => (
  <Button
    bsSize="small"
    onClick={onClick}
    title="Add or edit"
  >
    <Glyphicon glyph="plus" />
    /
    <Glyphicon glyph="pencil" />
  </Button>
);

class GeneraUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModalUsersGenera: false,
      editId: undefined,
    };
  }

  showModal = (id) => {
    this.setState({
      showModalUsersGenera: true,
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
    this.setState({ showModalUsersGenera: false });
  }

  formatResult = (data) => data.map((u) => ({
    id: u.id,
    username: u.username,
    genera: (
      <div>
        <GeneraList key={u.id} data={u.genera} />
        <GenusButtonAddEdit onClick={() => this.showModal(u.id)} />
      </div>
    ),
  }))

  render() {
    const { data, onTableChange } = this.props;
    const { editId, showModalUsersGenera } = this.state;

    return (
      <div>
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
        <UsersGeneraModal
          user={data.find((u) => u.id === editId)}
          show={showModalUsersGenera}
          onHide={this.hideModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(
  TabledPage({
    getAll: config.uris.usersUri.getAllWGeneraUri,
    getCount: config.uris.usersUri.countUri,
  })(GeneraUsers),
);

GenusButtonAddEdit.propTypes = {
  onClick: PropTypes.func.isRequired,
};

GeneraUsers.propTypes = {
  data: PropTypes.arrayOf(UserType.type).isRequired,
  onTableChange: PropTypes.func.isRequired,
  paginationOptions: PropTypes.shape({
    page: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
  }).isRequired,
};
