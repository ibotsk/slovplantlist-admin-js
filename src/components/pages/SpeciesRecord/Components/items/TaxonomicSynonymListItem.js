import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

import PropTypes from 'prop-types';
import SynonymType from 'components/propTypes/synonym';

import SynonymListItem from 'components/segments/SynonymListItem';

import config from 'config/config';

const TaxonomicSynonymListItem = ({
  rowId,
  data,
  onRowDelete,
  onChangeToNomenclatoric,
  onChangeToInvalid,
}) => {
  const Additions = () => (
    <>
      {
        onChangeToNomenclatoric
        && (
          <Button
            bsStyle="primary"
            bsSize="xsmall"
            onClick={() => onChangeToNomenclatoric(rowId)}
            title="Change to nomenclatoric synonym"
          >
            <Glyphicon glyph="share-alt" />
            {' '}
            {config.mappings.synonym.nomenclatoric.prefix}
          </Button>
        )
      }
      &nbsp;
      {
        onChangeToInvalid
        && (
          <Button
            bsStyle="primary"
            bsSize="xsmall"
            onClick={() => onChangeToInvalid(rowId)}
            title="Change to invalid designation"
          >
            <Glyphicon glyph="share-alt" />
            {' '}
            {config.mappings.synonym.invalid.prefix}
          </Button>
        )
      }
    </>
  );
  return (
    <SynonymListItem
      rowId={rowId}
      data={data}
      prefix={config.mappings.synonym.taxonomic.prefix}
      additions={Additions}
      showSubNomenclatoric
      onRowDelete={onRowDelete}
    />
  );
};

export default TaxonomicSynonymListItem;

TaxonomicSynonymListItem.propTypes = {
  rowId: PropTypes.number.isRequired,
  data: SynonymType.type.isRequired,
  onRowDelete: PropTypes.func.isRequired,
  onChangeToNomenclatoric: PropTypes.func,
  onChangeToInvalid: PropTypes.func,
};

TaxonomicSynonymListItem.defaultProps = {
  onChangeToNomenclatoric: undefined,
  onChangeToInvalid: undefined,
};
