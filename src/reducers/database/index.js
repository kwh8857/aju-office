const initialState = {
  key: undefined,
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
const database = (state = initialState, { type, idx, payload, index }) => {
  switch (type) {
    case "@layouts/INIT_KEY": {
      return {
        ...state,
        key: payload,
      };
    }
    case "@layouts/INIT_DELETELIST": {
      let arr = state.deletelist;
      arr.push(payload);
      return {
        ...state,
        deletelist: [...arr],
      };
    }
    case "@layouts/RESET": {
      state.videolist = [];
      return {
        ...state,
        editor: [
          {
            type: "TITLE",
            content: "",
            id: `title-${
              new Date().getTime() -
              Math.floor(Math.random() * (100 - 1 + 1)) +
              1
            }`,
          },
        ],
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
    case "@layouts/CHANGE_SUMMARY": {
      var str = state.editor;
      str[idx].content.text = payload;
      return {
        ...state,
        editor: [...str],
      };
    }
    case "@layouts/CHANGE_SUMMARY_IMAGE": {
      var edr = state.editor;
      edr[idx].content.img = payload;
      return {
        ...state,
        editor: [...edr],
      };
    }
    default:
      return state;
  }
};
export default database;
