import axios from 'axios';
import queryString from 'query-string';

import { handleAxiosError } from './response-handler';

export default (accessToken) => {
    axios.interceptors.request.use(
        config => {
            config.url = parseUrl(config.url, accessToken);
            return config;
        },
        error => Promise.reject(error)
    );
    
    axios.interceptors.response.use(
        res => res,
        error => {
            handleAxiosError(error);
            return Promise.reject(error);
        }
    );

    return axios;
};

/**
 * Adds access_token param to url
 * @param {*} urlToParse 
 * @param {*} accessToken 
 */
function parseUrl(urlToParse, accessToken) {
    const { url, query } = queryString.parseUrl(urlToParse);
    query.access_token = accessToken;
    const queryStr = queryString.stringify(query);
    return `${url}?${queryStr}`;
}

// export default axios;