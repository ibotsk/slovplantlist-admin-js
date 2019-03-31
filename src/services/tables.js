import template from 'url-template';
import axios from './axios';

const getAll = async (uri, offset, where, order, limit, accessToken) => {
    const getAllUri = template.parse(uri).expand({ 
        offset, 
        where: JSON.stringify(where), 
        order: JSON.stringify(order), 
        limit, 
        accessToken });
    const response = await axios.get(getAllUri);
    return response.data;
}

const getCount = async (uri, whereString, accessToken) => {
    const getCountUri = template.parse(uri).expand({ whereString, accessToken });
    const response = await axios.get(getCountUri);
    return response.data;
}

export default {
    getAll,
    getCount
}