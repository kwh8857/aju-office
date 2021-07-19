const initialState = {
  tempo: [
    {
      type: "CONTENT",
      content: "",
    },
  ],
  editor: {
    bold: false,
    color: undefined,
    align: "left",
    underline: false,
    size: 15,
    drag: undefined,
  },
  post: [],
};
const test = (state = initialState, { type, payload, index }) => {
  switch (type) {
    case "@test/DRAG_ELEMENT": {
      return {
        ...state,
        editor: {
          ...state.editor,
          drag: payload,
        },
      };
    }
    case "@test/CHANGE_SIZE": {
      return {
        ...state,
        editor: {
          ...state.editor,
          size: payload,
        },
      };
    }
    case "@test/CHANGE_UNDER": {
      return {
        ...state,
        editor: {
          ...state.editor,
          underline: payload,
        },
      };
    }
    case "@test/CHANGE_ALIGN": {
      return {
        ...state,
        editor: {
          ...state.editor,
          align: payload,
        },
      };
    }
    case "@test/CHANGE_COLOR": {
      return {
        ...state,
        editor: {
          ...state.editor,
          color: payload,
        },
      };
    }
    case "@test/CHANGE_BOLD": {
      // const arr = [...state.tempo]
      // arr.splice(index, 0, payload)
      return {
        ...state,
        editor: {
          ...state.editor,
          bold: payload,
        },
      };
    }
    case "@test/ADD_CONTENT": {
      // const arr = [...state.tempo]
      // arr.splice(index, 0, payload)
      return {
        ...state,
        tempo: payload,
      };
    }
    case "@test/UPDATE_CONTENT": {
      let arr = [...state.tempo];
      arr[index].content = payload;
      return {
        ...state,
        tempo: [...arr],
      };
    }
    case "@test/ADD_REF": {
      let arr = [...state.tempo];
      arr[index].ref = payload;
      return {
        ...state,
        tempo: [...arr],
      };
    }
    case "@test/DELETE_CONTENT": {
      let arr = [...state.tempo];
      arr.splice(index, 1);
      return {
        ...state,
        tempo: [...arr],
      };
    }
    case "@test/TESTING": {
      return {
        ...state,
        post: [...state.post, payload],
      };
    }
    default:
      return state;
  }
};
export default test;
