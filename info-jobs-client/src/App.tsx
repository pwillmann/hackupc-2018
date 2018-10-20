import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStyle } from './globalStyles';
import { Routes } from './routes';

class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <GlobalStyle />
        <Router>
          <Routes />
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
