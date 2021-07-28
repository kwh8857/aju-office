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
const Fstorage = firebaseApp.storage();
function Editor({ location }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { type, timestamp, category, id } = location.state;
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
      if (category === "portfolio") {
        const { title, sub } = info;
        Fstore.collection("editor")
          .doc(temKey)
          .update({
            template: template,
            title: title ? title : "임시저장 게시물",
            sub: sub ? sub : "",
          })
          .then(() => {
            setIsExit(true);
            if (path) {
              history.push(path);
            }
          });
      } else {
        const { title } = info;
        Fstore.collection("editor")
          .doc(temKey)
          .update({
            template: template,
            title: title ? title : "임시저장 게시물",
          })
          .then(() => {
            setIsExit(true);
            if (path) {
              history.push(path);
            }
          });
      }
    },
    [temKey, template, info, history, category]
  );

  useEffect(() => {
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
            info: {
              title: value.title,
              sub: category !== "notice" ? value.sub : undefined,
            },
          });
          if (value.videoList) {
            dispatch({
              type: "@layouts/INIT_VIDEO",
              payload: value.videoList,
            });
          } else {
            dispatch({
              type: "@layouts/INIT_VIDEO",
              payload: [],
            });
          }
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
  }, [dispatch, category, id, type, timestamp]);

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
          <TitleSection category={category} dispatch={patch} info={info} />
          <div className="editor-wrapper">
            <EdiHeader setIsUp={setIsUp} temKey={temKey} category={category} />
            <Screen temKey={temKey} Fstore={Fstore} Fstorage={Fstorage} />
          </div>
          <Popup isUp={isUp} setIsUp={setIsUp} temKey={temKey} />
        </div>
      </Animation>
    </Beforeunload>
  );
}

export default Editor;
