const initialState = {
  identification: {
    version: "0.0.1",
    state: "test",
  },
};
const config = (state = initialState, { type, payload }) => {
  switch (type) {
    default:
      return state;
  }
};
export default config;
