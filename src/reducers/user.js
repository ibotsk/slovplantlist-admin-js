import { SET_USER, UNSET_USER } from '../actions/action-types';
import config from '../config/config';

const initialState = { 
    role: config.mappings.userRole.author.name,
    userGenera: []
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                ...{
                    id: action.id,
                    role: action.role,
                    userGenera: action.userGenera
                }
            };
        case UNSET_USER:
            return {};
        default:
            return state
    }
}

export default user;