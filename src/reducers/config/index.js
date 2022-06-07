const initialState = {
  identification: {
    version: "0.0.1",
    state: "test",
  },
  isLogin: false,
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
    case "@config/isLogin": {
      return {
        ...state,
        isLogin: payload,
      };
    }
    default:
      return state;
  }
};
export default config;
