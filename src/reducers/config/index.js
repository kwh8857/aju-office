const initialState = {
  identification: {
    version: "0.0.1",
    state: "test",
  },
  isLoading: false,
};
const config = (state = initialState, { type, payload }) => {
  switch (type) {
    case "@config/isLoading": {
      return {
        ...state,
        isLoading: payload,
      };
    }
    default:
      return state;
  }
};
export default config;
