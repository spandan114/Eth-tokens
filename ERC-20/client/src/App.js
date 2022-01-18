import React, { useState, useEffect } from "react";
import "./App.css";
import { loadBlockchainData, loadWeb3 } from "./utils/web3Connector";

const App = () => {
  useEffect(() => {
    const load = async () => {
      await loadWeb3();
      const contractData = await loadBlockchainData();
      console.log(contractData);
    };
    load();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
