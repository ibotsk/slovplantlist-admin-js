const nullToEmpty = (obj) => Object.keys(obj).reduce(
  (prev, curr) => ({
    ...prev,
    [curr]: obj[curr] ? obj[curr] : '',
  }),
  {},
);

/**
 * true, false, false, true => '1001'
 * @param  {...boolean} bits
 */
const boolsToStr = (...bits) => (
  bits.map((b) => `${+b}`).join()
);

const capitalize = (s) => (
  s.charAt(0).toUpperCase() + s.slice(1)
);

export default {
  nullToEmpty,
  boolsToStr,
  capitalize,
};
