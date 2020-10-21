import Mustache from 'mustache';

import config from 'config/config';

const { constants } = config;

Mustache.tags = constants.mustacheTags;

export default Mustache;
