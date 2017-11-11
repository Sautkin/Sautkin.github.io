import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer
class App extends Component {
  @observable q = 4;
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro" onClick={() => this.q++}>
          { this.q }
        </p>
      </div>
    );
  }
}

export default App;
