import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Col, Row,
  Button, Modal, ListGroupItem, Glyphicon,
  Form, FormGroup, ControlLabel,
} from 'react-bootstrap';

import PropTypes from 'prop-types';
import UserType from 'components/propTypes/user';

import AddableList from 'components/segments/AddableList';

import { notifications } from 'utils';

import {
  genusFacade,
  usersFacade,
  usersGeneraFacade,
} from 'facades';

const genusFormat = (g) => ({ id: g.id, label: g.name });
const genusCompare = (g1, g2) => (
  g1.label < g2.label ? -1 : g1.label > g2.label
);

const UserGenusListItem = ({ rowId, data: { label }, onRowDelete }) => (
  <ListGroupItem>
    {label}
    <span className="pull-right">
      <Button
        bsStyle="danger"
        bsSize="xsmall"
        onClick={() => onRowDelete(rowId)}
        title="Remove from this list"
      >
        <Glyphicon glyph="remove" />
      </Button>
    </span>
  </ListGroupItem>
);

class UsersGeneraModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGenera: [],
      userGeneraToAdd: [],
      userGeneraToRemove: [],
      genera: [],
    };
  }

  async componentDidMount() {
    const { accessToken } = this.props;
    const genera = await genusFacade.getAllGeneraWithFamilies(
      accessToken, genusFormat,
    );
    this.setState({
      genera,
    });
  }

  onEnter = async () => {
    const { user, accessToken } = this.props;

    if (user) {
      const userGenera = await usersFacade.getGeneraOfUser(
        user.id, accessToken, genusFormat,
      );
      userGenera.sort(genusCompare);
      this.setState({
        userGenera,
      });
    }
  }

  handleAddGenus = (selected) => {
    const idToAdd = selected.id;
    this.setState((state) => {
      const { userGenera, userGeneraToAdd } = state;

      if (!userGenera.find((g) => g.id === idToAdd)) {
        userGenera.push(selected);
        userGeneraToAdd.push(idToAdd);
      }
      userGenera.sort(genusCompare);

      return {
        userGenera,
        userGeneraToAdd,
      };
    });
  }

  handleRemoveGenus = (genusId) => (
    this.setState((state) => {
      const { userGenera, userGeneraToRemove } = state;
      const userGeneraWithoutId = userGenera.filter((g) => g.id !== genusId);

      userGeneraToRemove.push(genusId);
      return {
        userGenera: userGeneraWithoutId,
        userGeneraToRemove,
      };
    })
  );

  handleHide = () => {
    this.setState({
      userGenera: [],
      userGeneraToAdd: [],
      userGeneraToRemove: [],
    });
    const { onHide } = this.props;
    onHide();
  }

  handleSave = async () => {
    const { user, accessToken } = this.props;
    const {
      userGeneraToAdd,
      userGeneraToRemove,
    } = this.state;

    try {
      await usersGeneraFacade.saveUserGenera({
        userId: user.id,
        generaIdsAdded: userGeneraToAdd,
        generaRemoved: userGeneraToRemove,
        accessToken,
      });
      notifications.success('Saved');
      this.handleHide();
    } catch (error) {
      notifications.error('Error saving');
      throw error;
    }
  }

  render() {
    const { show, user } = this.props;
    const { userGenera, genera } = this.state;
    return (
      <Modal show={show} onHide={this.handleHide} onEnter={this.onEnter}>
        <Modal.Header closeButton>
          <Modal.Title>
            Editing genera of user
            {' '}
            {user ? user.username : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <Row>
              <Col componentClass={ControlLabel} xs={3} className="text-left">
                Assigned genera
              </Col>
            </Row>
            <FormGroup controlId="user-genera" bsSize="sm">
              <Col xs={12}>
                <AddableList
                  id="user-genera-autocomplete"
                  data={userGenera}
                  options={genera}
                  onAddItemToList={this.handleAddGenus}
                  onRowDelete={this.handleRemoveGenus}
                  getRowId={(d) => d.id} // this overrides default rowIndex
                  itemComponent={UserGenusListItem}
                />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide}>Close</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(UsersGeneraModal);

UsersGeneraModal.propTypes = {
  show: PropTypes.bool.isRequired,
  user: UserType.type,
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};
UsersGeneraModal.defaultProps = {
  user: undefined,
};

UserGenusListItem.propTypes = {
  rowId: PropTypes.number.isRequired,
  onRowDelete: PropTypes.func.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
};
