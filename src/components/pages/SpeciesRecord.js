import React, { Component } from 'react';

import {
    Grid, Col, Well,
    Form, FormControl, FormGroup, ControlLabel
} from 'react-bootstrap';

import LosName from '../segments/LosName';
import speciesFacade from '../../facades/species';

import config from '../../config/config';

const LABEL_COL_WIDTH = 2;
const CONTENT_COL_WIDTH = 10;

const ntypes = config.mappings.losType;

class SpeciesRecord extends Component {

    constructor(props) {
        super(props);

        this.state = {
            record: {}
        };

    }

    handleChangeInput = e => {
        this.handleChange(e.target.id, e.target.value);
    }

    handleChange = (property, value) => {
        const record = { ...this.state.record };
        record[property] = value;
        this.setState({
            record
        });
    }

    async componentDidMount() {
        const recordId = this.props.match.params.id;
        const record = await speciesFacade.getRecordById(recordId);
        this.setState({
            record
        });
    }

    render() {
        console.log(this.state);

        return (
            <div id='species-detail'>
                <Grid>
                    <h2>Checklist record <small>({this.state.record ? <LosName data={this.state.record} /> : 'new'})</small></h2>

                    <Form horizontal >
                        <div id="name">
                            <h3>Name</h3>
                            <Well>
                                <FormGroup controlId="ntype" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Type
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            componentClass="select"
                                            placeholder="select"
                                            value={this.state.ntype}
                                            onChange={this.handleChangeInput} >
                                            {
                                                Object.keys(ntypes).map(t => <option value={t} key={t}>{ntypes[t].text}</option>)
                                            }
                                        </FormControl>
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="genus" bsSize="sm">
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Genus (text):
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.genus || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Genus as text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="species" bsSize="sm">
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Species:
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.species || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Species" />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="subsp" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Subsp:
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.subsp || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Subsp"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="var" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Var:
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.var || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Var"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="subvar" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Subvar:
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.subvar || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Subvar"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="forma" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Forma:
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.forma || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Forma"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="authors" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Authors:
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.authors || ''}
                                            placeholder="Authors"
                                            onChange={this.handleChangeInput}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="nothosubsp" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Nothosubsp:
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.nothosubsp || ''}
                                            placeholder="Nothosubsp"
                                            onChange={this.handleChangeInput}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="nothoforma" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Nothoforma:
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.nothoforma || ''}
                                            placeholder="Nothoforma"
                                            onChange={this.handleChangeInput}
                                        />
                                    </Col>
                                </FormGroup>
                            </Well>
                        </div>
                    </Form>
                </Grid>
            </div>
        );
    }

}

export default SpeciesRecord;