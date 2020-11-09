import React from 'react';

import PropTypes from 'prop-types';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

// TODO: this renderer is not used, it is not completed
class TypeaheadCellEditRenderer extends React.Component {
  constructor(props) {
    super(props);

    const { value } = props;

    this.state = {
      isLoading: false,
      value: value ? [value] : [],
      options: [],
    };
  }

  getValue() {
    const { value } = this.state;
    return value[0];
  }

  handleSearch = async (query) => {
    this.setState({ isLoading: true });

    const { accessToken, fetch } = this.props;
    const results = await fetch(query, accessToken);
    this.setState({
      isLoading: false,
      options: results,
    });

    return results;
  }

  handleOnChange = (selected) => {
    this.setState({ value: selected });
  }

  // TODO: add buttons for save and cancel
  render() {
    const { isLoading, value, options } = this.state;
    const { id, labelKey } = this.props;

    return (
      <AsyncTypeahead
        id={id}
        labelKey={labelKey}
        isLoading={isLoading}
        onSearch={this.handleSearch}
        options={options}
        selected={value}
        onChange={this.handleOnChange}
        placeholder="Start by typing (case sensitive)"
      />
    );
  }
}

export default TypeaheadCellEditRenderer;

TypeaheadCellEditRenderer.propTypes = {
  id: PropTypes.string.isRequired,
  labelKey: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any.isRequired,
  accessToken: PropTypes.string.isRequired,
  fetch: PropTypes.func.isRequired,
};

TypeaheadCellEditRenderer.defaultProps = {
  labelKey: undefined,
};
