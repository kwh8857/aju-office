import React, { useState, useEffect, useCallback } from "react";
import "./css/index.css";
import EdiHeader from "./components/EdiHeader";
import Screen from "./components/Screen";
import Popup from "./components/Popup";
import Header from "../Header/Header";
import firebaseApp from "../config/firebaseApp";
import { useDispatch, useSelector } from "react-redux";
import { useBeforeunload } from "react-beforeunload";
import { Prompt } from "react-router-dom";
const Fstore = firebaseApp.firestore();
function Editor({ location }) {
  const dispatch = useDispatch();
  const temKey = useSelector((state) => state.database.key);
  const template = useSelector((state) => state.database.editor);

  const [isUp, setIsUp] = useState({
    status: false,
    type: "",
  });
  const __updateData = useCallback(() => {
    Fstore.collection("editor").doc(temKey).update({ template: template });
  }, [temKey, template]);
  useBeforeunload((e) => {
    __updateData();
    e.preventDefault();
  });

  useEffect(() => {
    if (location.state.type === "new") {
      Fstore.collection("editor")
        .add({ timestamp: Date.now() })
        .then((res) => {
          dispatch({
            type: "@layouts/INIT_KEY",
            payload: res.id,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {};
  }, [dispatch, location]);
  return (
    <>
      <Prompt
        message={() => {
          __updateData();
          return "템플릿을 저장하고 나가시겠습니까?";
        }}
      />
      <div className="editor">
        <Header />
        <div className="editor-wrapper">
          <EdiHeader setIsUp={setIsUp} temKey={temKey} />
          <Screen temKey={temKey} />
        </div>
        <Popup isUp={isUp} setIsUp={setIsUp} temKey={temKey} />
      </div>
    </>
  );
}

export default Editor;
