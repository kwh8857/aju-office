const initialState = {
  editor: [
    {
      type: "TITLE",
      content: "",
      id: `title-${
        new Date().getTime() - Math.floor(Math.random() * (100 - 1 + 1)) + 1
      }`,
    },
  ],
  focusIdx: 0,
  videolist: [],
  deletelist: [],
};
const database = (state = initialState, { type, idx, payload }) => {
  switch (type) {
    case "@layouts/INIT_DELETELIST": {
      let arr = state.deletelist;
      arr.push(payload);
      return {
        ...state,
        deletelist: [...arr],
      };
    }

    case "@layouts/UPDATE_VIDEO": {
      let arr = state.videolist;
      state.videolist[idx] = payload;
      return {
        ...state,
        videolist: [...arr],
      };
    }
    case "@layouts/INIT_VIDEO":
      return {
        ...state,
        videolist: payload,
      };
    case "@layouts/CHANGE_FOCUS":
      return {
        ...state,
        focusIdx: payload,
      };
    case "@layouts/CHANGE_EDITOR":
      return {
        ...state,
        editor: payload,
      };
    case "@layouts/CHANGE_TITLE": {
      var arr = state.editor;
      arr[idx].content = payload;
      return {
        ...state,
        editor: [...arr],
      };
    }
    default:
      return state;
  }
};
export default database;
