import React, { useState, useEffect, useCallback, useReducer } from "react";
import "./css/index.css";
import EdiHeader from "./components/EdiHeader";
import Screen from "./components/Screen";
import Popup from "./components/Popup";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { Beforeunload } from "react-beforeunload";
import { Prompt, useHistory } from "react-router-dom";
import firebaseApp from "../config/firebaseApp";
import TitleSection from "./components/TitleSection";
import { Animation } from "../styles/Animation";
const Fstore = firebaseApp.firestore();

function Editor({ location }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const temKey = useSelector((state) => state.database.key);
  const template = useSelector((state) => state.database.editor);

  function reducer(state, action) {
    switch (action.type) {
      case "RESET":
        return {
          title: undefined,
          sub: undefined,
        };
      case "INIT":
        return action.info;
      case "TITLE":
        return { ...state, title: action.title };
      case "SUB":
        return { ...state, sub: action.sub };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }

  const [info, patch] = useReducer(reducer, {
    title: undefined,
    sub: undefined,
  });
  const [isUp, setIsUp] = useState({
    status: false,
    type: "",
  });
  const [isExit, setIsExit] = useState(false);
  const __updateData = useCallback(
    (path) => {
      const { title, sub } = info;

      Fstore.collection("editor")
        .doc(temKey)
        .get()
        .then((res) => {
          const list = res.data().storageList;
          if (list) {
            const imageMap = new Map();
            template.forEach(({ type, content: { resize, url } }, idx) => {
              if (type === "IMAGE") {
                imageMap.set(resize, true);
                imageMap.set(url, true);
              }
            });
            const changeOb = Object.fromEntries(imageMap);
            const filt = list.filter((item) => !changeOb[item]);

            console.log(filt);
          }
          res.ref.update({ template: template, title, sub }).then(() => {
            setIsExit(true);
            if (path) {
              history.push(path);
            }
          });
        });
    },
    [temKey, template, info, history]
  );

  useEffect(() => {
    const { type, timestamp, category, id } = location.state;
    if (type === "new") {
      Fstore.collection("editor")
        .add({
          timestamp: timestamp,
          state: category,
        })
        .then((res) => {
          patch({
            type: "RESET",
          });
          dispatch({
            type: "@layouts/INIT_KEY",
            payload: res.id,
          });
          dispatch({
            type: "@layouts/RESET",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Fstore.collection("editor")
        .doc(id)
        .get()
        .then((result) => {
          const value = result.data();
          patch({
            type: "INIT",
            info: { title: value.title, sub: value.sub },
          });
          dispatch({
            type: "@layouts/CHANGE_EDITOR",
            payload: value.template,
          });
        });
      dispatch({
        type: "@layouts/INIT_KEY",
        payload: id,
      });
    }
    return () => {};
  }, [dispatch, location]);

  return (
    <Beforeunload
      onBeforeunload={(e) => {
        __updateData();
        e.preventDefault();
      }}
    >
      <Prompt
        message={(e) => {
          if (!isExit) {
            __updateData(e.pathname);
            return false;
          } else {
            return true;
          }
        }}
      />
      <Animation>
        <div className="editor">
          <Header />
          <TitleSection
            category={location.state.category}
            dispatch={patch}
            info={info}
          />
          <div className="editor-wrapper">
            <EdiHeader setIsUp={setIsUp} temKey={temKey} />
            <Screen temKey={temKey} />
          </div>
          <Popup isUp={isUp} setIsUp={setIsUp} temKey={temKey} />
        </div>
      </Animation>
    </Beforeunload>
  );
}

export default Editor;
