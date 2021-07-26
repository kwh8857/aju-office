import React, { useState, useEffect, useCallback, useReducer } from "react";
import "./css/index.css";
import EdiHeader from "./components/EdiHeader";
import Screen from "./components/Screen";
import Popup from "./components/Popup";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { Beforeunload } from "react-beforeunload";
import { Prompt } from "react-router-dom";
import firebaseApp from "../config/firebaseApp";
import TitleSection from "./components/TitleSection";
import { Animation } from "../styles/Animation";
const Fstore = firebaseApp.firestore();

function Editor({ location }) {
  const dispatch = useDispatch();
  const temKey = useSelector((state) => state.database.key);
  const template = useSelector((state) => state.database.editor);

  function reducer(state, action) {
    switch (action.type) {
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
  const __updateData = useCallback(() => {
    const { title, sub } = info;
    Fstore.collection("editor")
      .doc(temKey)
      .update({ template: template, title, sub });
  }, [temKey, template, info]);

  useEffect(() => {
    const { type, timestamp, category, id } = location.state;
    if (type === "new") {
      Fstore.collection("editor")
        .add({
          timestamp: timestamp,
          state: category,
        })
        .then((res) => {
          dispatch({
            type: "@layouts/INIT_KEY",
            payload: res.id,
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
        message={() => {
          __updateData();
          return "템플릿을 저장하고 나가시겠습니까?";
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
