import React, { Component } from 'react';
import { Col, Checkbox, 
    FormGroup, FormControl, InputGroup, 
    Row, Radio, 
    Button, Glyphicon } from 'react-bootstrap';

const NTYPES_GROUP = ["A", "PA", "S", "DS"];

class Filter extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: '',
            ntypes: {
                All: true,
                A: false,
                PA: false,
                S: false,
                DS: false
            }
        };
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    composeWhere() {
        const where = {};
        const checkedItems = Object.entries(this.state.ntypes).filter(entry => entry[1] === true);
        if (checkedItems.some(element => NTYPES_GROUP.includes(element[0]))) {
            const or = [];
            checkedItems.forEach(element => {
                or.push({ntype: element[0]});
            });
            where.or = or;
        }
        return where;
    }

    handleChange(element) {
        const ntypes = this.state.ntypes;
        ntypes[element.value] = element.checked;

        this.setState({ ntypes: ntypes });

        const where = this.composeWhere();
        console.log(where);
        this.props.onHandleChange(where);
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
                            <Checkbox name="ntype" value="All" checked={this.state.ntypes.All} onChange={(e) => this.handleChange(e.target)} >All</Checkbox>
                            <hr />
                            <Checkbox name="ntype" value="A" checked={this.state.ntypes.A} onChange={(e) => this.handleChange(e.target)} >A</Checkbox>
                            <Checkbox name="ntype" value="PA" checked={this.state.ntypes.PA} onChange={(e) => this.handleChange(e.target)} >PA</Checkbox>
                            <Checkbox name="ntype" value="S" checked={this.state.ntypes.S} onChange={(e) => this.handleChange(e.target)} >S</Checkbox>
                            <Checkbox name="ntype" value="DS" checked={this.state.ntypes.DS} onChange={(e) => this.handleChange(e.target)} >DS</Checkbox>
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
                    </Col>
                </form>
            </Row>
        );
    }

}

export default Filter;