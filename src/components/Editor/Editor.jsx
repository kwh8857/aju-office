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
import Loading from "./components/Loading";
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
          year: undefined,
          kind: undefined,
        };
      case "INIT":
        return action.info;
      case "TITLE":
        return { ...state, title: action.title };
      case "SUB":
        return { ...state, sub: action.sub };
      case "YEAR":
        return { ...state, year: action.year };
      case "KIND":
        return { ...state, kind: action.kind };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }

  const [info, patch] = useReducer(reducer, {
    title: undefined,
    sub: undefined,
    year: undefined,
    kind: undefined,
  });
  const [isUp, setIsUp] = useState({
    status: false,
    type: "",
  });
  const [isExit, setIsExit] = useState(false);
  const __updateData = useCallback(
    (path) => {
      if (category === "portfolio") {
        const { title, sub, kind, year } = info;
        let mainimg = null;
        const mainfilt = template.filter(({ type }) => type === "SUMMARY");
        if (
          mainfilt.length > 0 &&
          mainfilt[0].content.img.img
        ) {
          mainimg = {
            resize: mainfilt[0].content.img.resize,
            url: mainfilt[0].content.img.img,
          };
        }
        Fstore.collection("editor")
          .doc(temKey)
          .update({
            template: template,
            title: title ? title : "임시저장",
            sub: sub ? sub : "",
            kind: kind ? kind : "",
            year: year ? year : "",
            mainimg: mainimg
              ? mainimg
              : {
                  resize:
                    "https://firebasestorage.googleapis.com/v0/b/steadee-pf.appspot.com/o/editor%2Fbasic%2Fbasic-reszie.jpeg?alt=media&token=42033a61-6b83-4627-990d-9dc0c713a152",
                  url: "https://firebasestorage.googleapis.com/v0/b/steadee-pf.appspot.com/o/editor%2Fbasic%2Fbasic.jpeg?alt=media&token=62440937-0aed-4387-8199-fa5c1c572b48",
                },
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
            title: title ? title : "임시저장",
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
            type: "@layouts/INIT_VIDEO",
            payload: [],
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
              kind:
                category !== "notice" && value.kind ? value.kind : undefined,
              year: category !== "notce" && value.year ? value.year : undefined,
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
          console.log(value.template);
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
  useEffect(() => {
    return () => {
      dispatch({
        type: "@layouts/RESET",
      });
    };
  }, [dispatch]);
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
      <Loading />
    </Beforeunload>
  );
}

export default Editor;
