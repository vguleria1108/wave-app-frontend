import * as React from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
const contractABI = abi.abi;
const contractAddress = "0xceB6Db65dCF69418b5Dbd1B6bF62921cee0aae5d";
function App() {
  const [totalWaves, setTotalWaves] = React.useState(0);
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [waves, setWaves] = React.useState([]);

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        setIsLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300000,
        });
        setMessage("");
        await waveTxn.wait();
        let count = await wavePortalContract.getTotalWaves();
        setTotalWaves(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const waves = await wavePortalContract.getAllWaves();
      setIsLoading(false);
      setWaves(waves);
    }
  };

  const getTotalWaves = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const count = await wavePortalContract.getTotalWaves();
      setTotalWaves(count.toNumber());
    }
  };

  React.useEffect(() => {
    getAllWaves();
  }, [totalWaves]);

  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  React.useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      getTotalWaves();
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      /*
       * First make sure we have access to window.ethereum
       */
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install metamask!");
      } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContract.getTotalWaves();
        setTotalWaves(count.toNumber());
        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          const account = accounts[0];
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
      setIsLoading(true);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setIsLoading(false);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          role="status"
          className="absolute w-screen top-0 right-0 flex justify-center items-center h-screen bg-zinc-500/20"
        >
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col p-[20px] mt-[20px] items-center gap-[20px]">
        <div className="font-semibold text-3xl">👋 Hey there!</div>
        <div className="max-w-[600px] text-center">
          I am a software engineer and I love building things that live on the
          internet. This is my first web3 app!
        </div>
        {currentAccount ? (
          <span>
            Currently {totalWaves} person{totalWaves === 1 ? "" : "s"} have
            waved at me.
          </span>
        ) : (
          ""
        )}
        {!currentAccount ? (
          <button
            className="px-[6px] py-[4px] border rounded-md border-gray-400"
            onClick={connectWallet}
          >
            Connect Wallet to Wave at Me
          </button>
        ) : (
          <div className="w-full flex flex-col gap-[8px] items-center">
            <div className="shadow-md gap-[12px] bg-white w-full flex flex-col max-w-[600px] p-[20px] rounded-md">
              <textarea
                value={message}
                onChange={(e) => setMessage(e?.target?.value)}
                className="border-0 resize-none max-h-[900px] focus:outline-none"
                placeholder="Message..."
              ></textarea>
            </div>
            <button
              className="px-[6px] py-[4px] border rounded-md border-gray-400"
              onClick={wave}
            >
              Wave at Me
            </button>
            <div className="flex flex-col mt-[64px]  max-w-[900px] w-full px-[20px] border rounded-md border-gray-400">
              {currentAccount ? (
                <div
                  className={`flex justify-between 
                  p-[8px] border-gray-400 w-full`}
                >
                  <div className="font-semibold overflow-hidden text-ellipsis">
                    User
                  </div>
                  <div className="self-start font-semibold ">Message</div>
                </div>
              ) : (
                ""
              )}
              {waves?.map((wave, index) => (
                <div
                  key={index}
                  className={`flex justify-between border-t p-[8px] border-gray-400 w-full`}
                >
                  <div className="font-semibold overflow-hidden text-ellipsis">
                    {wave?.[0]}
                  </div>
                  <div className="self-start ">{wave.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
