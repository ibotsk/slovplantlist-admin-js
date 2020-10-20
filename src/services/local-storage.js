const KEY_STATE = 'state';

export function loadState() {
  try {
    const serializedState = localStorage.getItem(KEY_STATE);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

export function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY_STATE, serializedState);
  } catch {
    // ignore write errors
  }
}

export function removeState() {
  try {
    localStorage.removeItem(KEY_STATE);
  } catch {
    // ignore
  }
}
