import React, { Component } from 'react';
import { Col, Checkbox, 
    FormGroup, FormControl, InputGroup, 
    Row, Radio, 
    Button, Glyphicon } from 'react-bootstrap';

class Filter extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: ''
        };
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <Row>
                <form>
                    <Col md={2}>
                        <h4>View records</h4>
                        <FormGroup>
                            <Radio name="filterrecords">
                                Mine
                            </Radio>
                            <Radio name="filterrecords">
                                All
                            </Radio>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <h4>Types</h4>
                        <FormGroup>
                            <Checkbox name="types[]" value="All">All</Checkbox>
                            <hr />
                            <Checkbox name="types[]" value="A">A</Checkbox>
                            <Checkbox name="types[]" value="PA">PA</Checkbox>
                            <Checkbox name="types[]" value="S">S</Checkbox>
                            <Checkbox name="types[]" value="DS">DS</Checkbox>
                        </FormGroup>
                    </Col>
                    <Col md={8}>
                        <InputGroup>
                            <InputGroup.Button>
                                <Button>
                                    <Glyphicon glyph="erase" />
                                </Button>
                            </InputGroup.Button>
                            <FormControl
                                type="text"
                                value={this.state.value}
                                placeholder="Search"
                                onChange={this.handleChange}
                            />
                            <InputGroup.Button>
                                <Button>
                                    <Glyphicon glyph="search" />
                                </Button>
                            </InputGroup.Button>
                        </InputGroup>
                        {/* <FormGroup
                            controlId="formBasicText"
                            validationState={this.getValidationState()}>
                            <ControlLabel>Working example with validation</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.value}
                                placeholder="Search"
                                onChange={this.handleChange}
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Validation is based on string length.</HelpBlock>
                        </FormGroup> */}
                    </Col>
                </form>
            </Row>
        );
    }

}

export default Filter;