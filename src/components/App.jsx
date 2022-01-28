import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./login/Login";
import "./styles/core.css";
import Main from "./Main/Main";
import Editor from "./Editor/Editor";
import Notice from "./Notice/Notice";
import { useDispatch, useSelector } from "react-redux";
import firebaseApp from "./config/firebaseApp";

const Fauth = firebaseApp.auth();
function Navigation() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.config.isLogin);
  useEffect(() => {
    Fauth.onAuthStateChanged((user) => {
      if (user && user.uid === "wQHhbrR0eVgM0lx0wkNiGcv2dvL2") {
        dispatch({
          type: "@config/isLogin",
          payload: true,
        });
      } else {
        dispatch({
          type: "@config/isLogin",
          payload: false,
        });
      }
    });
    return () => {};
  }, [dispatch]);

  return (
    <Router>
      <Switch>
        {isLogin ? (
          <>
            <Route path="/" exact component={Main} />
            <Route path="/notice" exact component={Notice} />
            <Route
              path="/editor"
              exact
              component={Editor}
              onLeave={() => {
                console.log("떠남");
              }}
            />
          </>
        ) : (
          <Route path="/" exact component={Login} />
        )}
      </Switch>
    </Router>
  );
}

export default Navigation;
