import React from 'react';

import {
    Button, Badge,
    Tooltip, OverlayTrigger
} from 'react-bootstrap';

const tooltip = (info) => (
    <Tooltip id="tooltip">
        {info}
    </Tooltip>
);

const tooltipInfo = (genus) => {
    return (
        <div>
            {genus.name} {genus.authors}
        </div>
    );
};

const listGroupItem = (genus) => {
    const info = tooltipInfo(genus);
    return (
        <Badge key={genus.id} className='white-badge'>
            <OverlayTrigger
                overlay={tooltip(info)}
                placement="top"
                delayShow={300}
            >
                <Button bsStyle="link" bsSize='xs'>{genus.name}</Button>
            </OverlayTrigger>
        </Badge>
    );
};

const GeneraList = (props) => {

    return (
        <div>
            {
                props.data.map(listGroupItem)
            }
        </div>
    );

}

export default GeneraList;