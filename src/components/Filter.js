import React, { Component } from 'react';
import {
    Col, Checkbox,
    FormGroup, FormControl, InputGroup,
    Row, Radio,
    Button, Glyphicon
} from 'react-bootstrap';

const NTYPES_GROUP = ["A", "PA", "S", "DS"];

class Filter extends Component {

    constructor(props, context) {
        super(props, context);

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

    composeWhere(ntypes, value) {
        const checkedItems = Object.entries(ntypes).filter(entry => entry[1] === true);
        const clauses = [];
        if (checkedItems.some(element => NTYPES_GROUP.includes(element[0]))) {
            const or = [];
            checkedItems.forEach(element => {
                or.push({ ntype: element[0] });
            });
            clauses.push({ or: or });
        }
        if (value && value.length >= this.props.searchFieldMinLength) {
            const or = [];
            this.props.searchFields.forEach(field => {
                or.push({
                    [field]: {
                        like: "%25" + value + "%25",
                        options: "i"
                    }
                });
            });
            clauses.push({ or: or })
        }
        if (clauses.length > 1) {
            return { and: clauses };
        }
        return clauses[0] || {};
    }

    handleChange(ntypes, searchValue) {
        const where = this.composeWhere(ntypes, searchValue);
        console.log(where);
        this.props.onHandleChange(where);
    }

    handleChangeTypes(element) {
        const ntypes = this.state.ntypes;
        ntypes[element.value] = element.checked;

        this.handleChange(ntypes, this.state.value);
        this.setState({ ntypes: ntypes });
    }

    handleChangeSearch(value) {
        this.handleChange(this.state.ntypes, value);
        this.setState({ value: value });
    }

    render() {
        return (
            <Row>
                <form onSubmit={(e) => e.preventDefault()}>
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
                            <Checkbox name="ntype" value="All" checked={this.state.ntypes.All} onChange={(e) => this.handleChangeTypes(e.target)} >All</Checkbox>
                            <hr />
                            <Checkbox name="ntype" value="A" checked={this.state.ntypes.A} onChange={(e) => this.handleChangeTypes(e.target)} >A</Checkbox>
                            <Checkbox name="ntype" value="PA" checked={this.state.ntypes.PA} onChange={(e) => this.handleChangeTypes(e.target)} >PA</Checkbox>
                            <Checkbox name="ntype" value="S" checked={this.state.ntypes.S} onChange={(e) => this.handleChangeTypes(e.target)} >S</Checkbox>
                            <Checkbox name="ntype" value="DS" checked={this.state.ntypes.DS} onChange={(e) => this.handleChangeTypes(e.target)} >DS</Checkbox>
                        </FormGroup>
                    </Col>
                    <Col md={8}>
                        <InputGroup>
                            <InputGroup.Button>
                                <Button onClick={() => this.handleChangeSearch('')}>
                                    <Glyphicon glyph="erase" />
                                </Button>
                            </InputGroup.Button>
                            <FormControl
                                type="text"
                                value={this.state.value}
                                placeholder="Search"
                                onChange={(e) => this.handleChangeSearch(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </form>
            </Row>
        );
    }

}

export default Filter;