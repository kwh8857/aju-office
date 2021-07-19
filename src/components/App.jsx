import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./login/Login";
import "./styles/core.css";
import Main from "./Main/Main";
import Editor from "./Editor/Editor";
function Navigation() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/main" exact component={Main} />
        <Route path="/editor" exact component={Editor} />
      </Switch>
    </Router>
  );
}

export default Navigation;
