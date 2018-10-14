import React from 'react';

import config from '../config/config';
import helper from '../utils/helper';

const LosName = (props) => {

    const nomen = props.nomen;
    const italic = props.italic;

    const nameArr = helper.listOfSpieces(nomen).map(t => {
        if (italic && t.format === config.format.italic) {
            return <i>{t.string}</i>;
        } else if (t.format === config.format.plain) {
            return t.string;
        } else {
            return t.string
        }
    }).reduce((prev, curr) => [prev, ' ', curr]);



    return nameArr;

}

export default LosName;