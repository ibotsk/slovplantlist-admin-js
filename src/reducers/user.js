import { SET_USER, UNSET_USER } from '../actions/action-types';
import config from '../config/config';

const initialState = { role: config.mappings.userRole.author.name };

const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                ...{
                    role: action.role
                }
            };
        case UNSET_USER:
            return {};
        default:
            return state
    }
}

export default user;