import React, { Component } from 'react';

import {
  Col,
  Button, Glyphicon,
  FormGroup, InputGroup,
  ListGroup, ListGroupItem,
} from 'react-bootstrap';

import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';

import PropTypes from 'prop-types';
// import SynonymListItem from './SynonymListItem';

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

  onAddItem = () => {
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

  renderAsync = (async) => {
    const { id } = this.props;
    const { isLoading, options, selected } = this.state;
    if (async) {
      return (
        <AsyncTypeahead
          id={id}
          bsSize="sm"
          ref={(typeahead) => { this.typeahead = typeahead; }}
          isLoading={isLoading}
          options={options}
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
        options={options}
        onChange={this.onChange}
        selected={selected}
        placeholder="Start by typing"
      />
    );
  }

  render() {
    const {
      data = [],
      itemComponent: ListRow,
      onRowDelete,
      async,
    } = this.props;
    const { selected } = this.state;
    return (
      <div className="addable-list compact-list">
        <ListGroup>
          {
            // row must contain id, props is the rest
            // ListRow is an injected component that will be rendered as item
            data.map(({ id, ...props }) => (
              <ListRow
                rowId={id}
                key={id}
                data={props}
                onRowDelete={() => onRowDelete(id)}
              />
            ))
          }
          <ListGroupItem>
            <FormGroup>
              <Col sm={12}>
                <InputGroup bsSize="sm">
                  {this.renderAsync(async)}
                  <InputGroup.Button>
                    <Button
                      bsStyle="success"
                      onClick={this.onAddItem}
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
  itemComponent: PropTypes.func.isRequired,
  onAddItemToList: PropTypes.func.isRequired,
  onRowDelete: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  async: PropTypes.bool,
};

AddableList.defaultProps = {
  id: undefined,
  data: [],
  async: false,
  onSearch: undefined,
};
