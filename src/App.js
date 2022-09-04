import * as React from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
const contractABI = abi.abi;
const contractAddress = "0xC29b19a379dcA80B39C312a075f0b881AB44F4dB";
function App() {
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [currentAccount, setCurrentAccount] = React.useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      /*
       * First make sure we have access to window.ethereum
       */
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install metamask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    checkIfWalletIsConnected();
  });

  return (
    <div className="flex flex-col p-[20px] mt-[20px] items-center gap-[20px]">
      <div className="font-semibold text-3xl">👋 Hey there!</div>
      <div className="max-w-[600px] text-center">
        I am a software engineer and I love building things that live on the
        internet. This is my first web3 app!
      </div>
      {!currentAccount ? (
        <button
          className="px-[6px] py-[4px] border rounded-md border-gray-400"
          onClick={connectWallet}
        >
          Connect Wallet to Wave at Me
        </button>
      ) : (
        <button
          className="px-[6px] py-[4px] border rounded-md border-gray-400"
          onClick={wave}
        >
          Wave at Me
        </button>
      )}
    </div>
  );
}

export default App;
