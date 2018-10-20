import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./routes";

class App extends React.Component {
  public render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}

export default App;
