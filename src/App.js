import React, { Component } from 'react';

import Header from './components/header';
import Header2 from './components/header2';
import Main from './pages/main';

class App extends Component {
  render() {
    return (
        <div className="App">
            <Header2 />
            <Main />
        </div>
    );
  }
}

export default App;
