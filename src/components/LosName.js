import React from 'react';

import config from '../config/config';
import helper from '../utils/helper';
import format from '../utils/formatter';

const LosName = (props) => {

    const nomen = props.nomen;

    const nameArr = helper.listOfSpieces(nomen).map(t => {
        console.log(t);
        if (t.format === config.format.formatted) {
            return format(t.string, props.format);
        } else {
            return t.string;
        }
    }).reduce((prev, curr) => [prev, ' ', curr]);



    return nameArr;

}

export default LosName;