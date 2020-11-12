import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

import PropTypes from 'prop-types';
import SynonymType from 'components/propTypes/synonym';

import SynonymListItem from 'components/segments/SynonymListItem';
import LosName from 'components/segments/Checklist/LosName';

import config from 'config/config';

const NomenclatoricSynonymListItem = ({
  rowId,
  data,
  onRowDelete,
  onChangeToTaxonomic,
  onChangeToInvalid,
}) => {
  const Additions = () => (
    <>
      {onChangeToTaxonomic
        && (
          <Button
            bsStyle="primary"
            bsSize="xsmall"
            onClick={() => onChangeToTaxonomic(rowId)}
            title="Change to taxonomic synonym"
          >
            <Glyphicon glyph="share-alt" />
            {' '}
            {config.mappings.synonym.taxonomic.prefix}
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
      nameComponent={LosName}
      prefix={config.mappings.synonym.nomenclatoric.prefix}
      additions={Additions}
      showSubNomenclatoric
      onRowDelete={onRowDelete}
    />
  );
};

export default NomenclatoricSynonymListItem;

NomenclatoricSynonymListItem.propTypes = {
  rowId: PropTypes.number.isRequired,
  data: SynonymType.type.isRequired,
  onRowDelete: PropTypes.func.isRequired,
  onChangeToTaxonomic: PropTypes.func,
  onChangeToInvalid: PropTypes.func,
};

NomenclatoricSynonymListItem.defaultProps = {
  onChangeToTaxonomic: undefined,
  onChangeToInvalid: undefined,
};
