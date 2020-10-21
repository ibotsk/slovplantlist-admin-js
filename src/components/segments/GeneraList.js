import React from 'react';

import {
  Button, Badge,
  Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import GenusType from 'components/propTypes/genus';

const tooltip = (info) => (
  <Tooltip id="tooltip">
    {info}
  </Tooltip>
);

const tooltipInfo = (genus) => (
  <div>
    <p>
      <strong>
        {genus.name}
        {' '}
        {genus.authors}
      </strong>
    </p>
    <p>
      Family:
      <strong>{genus.family ? genus.family.name : '-'}</strong>
    </p>
    <p>
      Family APG:
      <strong>{genus.familyApg ? genus.familyApg.name : '-'}</strong>
    </p>
  </div>
);

const listGroupItem = (genus) => {
  const info = tooltipInfo(genus);
  return (
    <Badge key={genus.id} className="white-badge">
      <OverlayTrigger
        overlay={tooltip(info)}
        placement="top"
        delayShow={300}
      >
        <Button bsStyle="link" bsSize="xs">{genus.name}</Button>
      </OverlayTrigger>
    </Badge>
  );
};

const GeneraList = ({ data }) => (
  <>
    {
      data.map(listGroupItem)
    }
  </>
);

export default GeneraList;

GeneraList.propTypes = {
  data: PropTypes.arrayOf(GenusType.type).isRequired,
};
