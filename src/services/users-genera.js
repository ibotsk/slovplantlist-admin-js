import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const putUserGenus = async ({ data, accessToken }) => {
    const usersGeneraUri = template.parse(config.uris.userGeneraUri.baseUri).expand({ accessToken });
    await axios.put(usersGeneraUri, data);
}

export default {
    putUserGenus
}