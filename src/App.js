import * as React from "react";
import { ethers } from "ethers";

function App() {
  const wave = () => {};
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}

export default App;
