import { createStore } from 'redux';

import rootReducer from 'reducers';

import { loadState, saveState } from './local-storage';

const persistedState = loadState();

const store = createStore(
  rootReducer,
  persistedState,
);

store.subscribe(() => {
  saveState({
    authentication: store.getState().authentication,
    user: store.getState().user,
  });
});

export default store;
