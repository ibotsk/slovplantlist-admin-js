import template from 'url-template';
import axiosModule from './axios';

export default (accessToken) => {

    const axios = axiosModule(accessToken);

    const getAll = async (uri, offset, where, order, limit) => {
        const getAllUri = template.parse(uri).expand({
            offset,
            where: JSON.stringify(where),
            order: JSON.stringify(order),
            limit
        });
        const response = await axios.get(getAllUri);
        return response.data;
    }

    const getCount = async (uri, whereString) => {
        const getCountUri = template.parse(uri).expand({ whereString });
        const response = await axios.get(getCountUri);
        return response.data;
    }

    return {
        getAll,
        getCount
    };
}
