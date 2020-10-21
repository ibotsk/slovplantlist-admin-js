import React, { Component } from 'react';

import {
  Col,
  Button, Glyphicon,
  FormGroup, InputGroup,
  ListGroup, ListGroupItem,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';

class AddableList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: undefined,
      options: [],
      isLoading: false,
    };
  }

  onChange = (selected) => {
    this.setState({
      selected,
    });
  }

  handleAddItem = () => {
    const { onAddItemToList } = this.props;
    this.setState((state) => {
      const { selected } = state;
      if (selected) {
        onAddItemToList(selected[0]);

        this.typeahead.getInstance().clear();
        return {
          selected: undefined,
        };
      }
      return undefined;
    });
  }

  handleSearchAsync = async (query) => {
    this.setState({ isLoading: true });
    const { onSearch } = this.props;
    const options = await onSearch(query);
    this.setState({
      isLoading: false,
      options,
    });
  }

  renderTypeahead = (async) => {
    const { id, options: propsOptions } = this.props;
    const { isLoading, options: stateOptions, selected } = this.state;
    if (async) {
      return (
        <AsyncTypeahead
          id={id}
          bsSize="sm"
          ref={(typeahead) => { this.typeahead = typeahead; }}
          isLoading={isLoading}
          options={stateOptions}
          onChange={this.onChange}
          selected={selected}
          onSearch={this.handleSearchAsync}
          placeholder="Start by typing (case sensitive)"
        />
      );
    }
    return (
      <Typeahead
        id={id}
        bsSize="sm"
        ref={(typeahead) => { this.typeahead = typeahead; }}
        options={propsOptions}
        onChange={this.onChange}
        selected={selected}
        placeholder="Start by typing"
      />
    );
  }

  render() {
    const {
      data = [],
      itemComponent: ListRowItem,
      getRowId,
      onRowDelete,
      async,
      ...props
    } = this.props;
    const { selected } = this.state;
    return (
      <div className="addable-list compact-list">
        <ListGroup>
          {
            // row must contain id, props is the rest
            // ListRow is an injected component that will be rendered as item
            data.map((d, index) => {
              const rowId = getRowId ? getRowId(d) : index;
              return (
                <ListRowItem
                  rowId={rowId}
                  key={rowId}
                  data={d}
                  onRowDelete={() => onRowDelete(rowId)}
                  // in the rest of the props are custom properties per item
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              );
            })
          }
          <ListGroupItem>
            <FormGroup>
              <Col sm={12}>
                <InputGroup bsSize="sm">
                  {this.renderTypeahead(async)}
                  <InputGroup.Button>
                    <Button
                      bsStyle="success"
                      onClick={this.handleAddItem}
                      disabled={!selected || selected.length < 1}
                      title="Add to this list"
                    >
                      <Glyphicon glyph="plus" />
                      {' '}
                      Add
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </Col>
            </FormGroup>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}

export default AddableList;

AddableList.propTypes = {
  id: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })),
  options: PropTypes.arrayOf(PropTypes.object),
  itemComponent: PropTypes.func.isRequired,
  getRowId: PropTypes.func,
  onAddItemToList: PropTypes.func.isRequired,
  onRowDelete: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  async: PropTypes.bool,
};

AddableList.defaultProps = {
  id: undefined,
  data: [],
  options: undefined,
  async: false,
  onSearch: undefined,
  getRowId: undefined,
};
