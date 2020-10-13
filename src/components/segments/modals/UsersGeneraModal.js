import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Col, Row,
    Button, Modal, ListGroupItem, Glyphicon,
    Form, FormGroup, ControlLabel
} from 'react-bootstrap';

import AddableList from '../AddableList';

import notifications from '../../../utils/notifications';

import generaFacade from '../../../facades/genus';
import usersFacade from '../../../facades/users';
import usersGeneraFacade from '../../../facades/users-genera';

const genusFormat = g => ({ id: g.id, label: g.name });
const genusCompare = (g1, g2) => (g1.label < g2.label ? -1 : g1.label > g2.label);

const UserGenusListItem = ({ rowId, data: genus, ...props }) => {
    return (
        <ListGroupItem>
            {genus.label}
            <span className="pull-right">
                <Button bsStyle="danger" bsSize="xsmall" onClick={() => props.onRowDelete(rowId)} title="Remove from this list"><Glyphicon glyph="remove" /></Button>
            </span>
        </ListGroupItem>
    );
}

class UsersGeneraModal extends Component {

    constructor(props) {
        super(props);

        this.accessToken = this.props.accessToken;

        this.state = {
            userGenera: [],
            userGeneraToAdd: [],
            userGeneraToRemove: [],
            genera: [],
        }
    }

    onEnter = async () => {
        if (this.props.user) {
            const userGenera = await usersFacade.getGeneraOfUser({
                userId: this.props.user.id,
                format: genusFormat,
                accessToken: this.accessToken
            });
            userGenera.sort(genusCompare);
            this.setState({
                userGenera
            });
        }
    }

    handleAddGenus = (selected) => {
        const idToAdd = selected.id;
        const userGenera = [...this.state.userGenera];
        const userGeneraToAdd = [...this.state.userGeneraToAdd];

        if (!userGenera.find(g => g.id === idToAdd)) {
            userGenera.push(selected);
            userGeneraToAdd.push(idToAdd);
        }
        userGenera.sort(genusCompare);


        this.setState({
            userGenera,
            userGeneraToAdd
        });
    }

    handleRemoveGenus = (id) => {
        const userGenera = this.state.userGenera.filter(g => g.id !== id);
        const userGeneraToRemove = [...this.state.userGeneraToRemove];

        userGeneraToRemove.push(id);
        
        this.setState({
            userGenera,
            userGeneraToRemove
        });
    }

    handleHide = () => {
        this.props.onHide();
        this.setState({
            userGenera: [],
            userGeneraToAdd: [],
            userGeneraToRemove: []
        });
    }

    handleSave = async () => {
        const userGeneraToAdd = [ ...this.state.userGeneraToAdd ];
        const userGeneraToRemove = [...this.state.userGeneraToRemove];
        
        try {
            await usersGeneraFacade.saveUserGenera({ 
                userId: this.props.user.id,
                generaIdsAdded: userGeneraToAdd,
                generaRemoved: userGeneraToRemove,
                accessToken: this.props.accessToken
            });
            notifications.success('Saved');
            this.handleHide();
        } catch (error) {
            notifications.error('Error saving');
            throw error;
        }
    }

async componentDidMount() {
    const genera = await generaFacade.getAllGeneraWithFamilies({ format: genusFormat, accessToken: this.accessToken });
    this.setState({
        genera
    });
}

render() {
    return (
        <Modal show={this.props.show} onHide={this.handleHide} onEnter={this.onEnter}>
            <Modal.Header closeButton>
                <Modal.Title>Editing genera of user {this.props.user ? this.props.user.username : ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form horizontal>
                    <Row>
                        <Col componentClass={ControlLabel} xs={3} className='text-left'>
                            Assigned genera
                            </Col>
                    </Row>
                    <FormGroup controlId="user-genera" bsSize='sm'>
                        <Col xs={12}>
                            <AddableList
                                id={`user-genera-autocomplete`}
                                data={this.state.userGenera}
                                options={this.state.genera}
                                onAddItemToList={this.handleAddGenus}
                                onRowDelete={this.handleRemoveGenus}
                                itemComponent={UserGenusListItem}
                            />
                        </Col>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.handleHide}>Close</Button>
                <Button bsStyle="primary" onClick={this.handleSave}>Save changes</Button>
            </Modal.Footer>
        </Modal>
    )
}
}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(UsersGeneraModal);