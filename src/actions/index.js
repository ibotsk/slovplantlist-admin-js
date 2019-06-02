import { 
    SET_AUTHENTICATED, 
    UNSET_AUTHENTICATED, 
    SET_USER, 
    UNSET_USER 
} from './action-types';

export const setAuthenticated = (token) => ({
    type: SET_AUTHENTICATED,
    accessToken: token,
    isAuthenticated: true
});

export const unsetAuthenticated = () => ({
    type: UNSET_AUTHENTICATED
});

export const setUser = (role, userGenera) => ({
    type: SET_USER,
    role,
    userGenera
});

export const unsetUser = () => ({
    type: UNSET_USER
});