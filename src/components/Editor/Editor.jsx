import React, { useState, useEffect } from "react";
import "./css/index.css";
import EdiHeader from "./components/EdiHeader";
import Screen from "./components/Screen";
import Popup from "./components/Popup";
import Header from "../Header/Header";
import firebaseApp from "../config/firebaseApp";
function Editor() {
  const [isUp, setIsUp] = useState({
    status: false,
    type: "",
  });
  useEffect(() => {
    // firebaseApp
    //   .firestore()
    //   .collection("editor")
    //   .doc("mInSEuoV1BqUVJf6tCOr")
    //   .get()
    //   .then((res) => {
    //     const val = res.data();
    //     console.log(val.test);
    //     val.test.get().then((res) => {
    //       console.log(res.data());
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    return () => {};
  }, []);
  return (
    <div className="editor">
      <Header />
      <div className="editor-wrapper">
        <EdiHeader setIsUp={setIsUp} />
        <Screen />
      </div>
      <Popup isUp={isUp} setIsUp={setIsUp} />
    </div>
  );
}

export default Editor;
