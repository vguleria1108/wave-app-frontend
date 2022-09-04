import * as React from "react";
import { ethers } from "ethers";

function App() {
  const wave = () => {};
  return (
    <div className="flex flex-col p-[20px] mt-[20px] items-center gap-[20px]">
      <div className="font-semibold text-3xl">👋 Hey there!</div>
      <div className="max-w-[600px] text-center">
        I am a software engineer and I love building things that live on the
        internet. This is my first web3 app!
      </div>
      <button
        className="px-[6px] py-[4px] border rounded-md border-gray-400"
        onClick={wave}
      >
        Wave at Me
      </button>
    </div>
  );
}

export default App;
