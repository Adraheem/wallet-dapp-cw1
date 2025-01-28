import { useEffect, useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const [amountInput, setAmountInput] = useState("");
  const [balance, setBalance] = useState("");
  const contractAddress = "0x88ccd742DB12B5Dce79166B43591720B71fC322D";

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const getContract = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(contractAddress, abi, signer);
    } else {
      throw new Error("Etherum not present");
    }
  };

  const getBalance = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.getBalance();
      console.log("Transaction successful", ethers.formatEther(tx));
      setBalance(ethers.formatEther(tx));
    } catch (error) {
      console.log("fail  transaction", error);
    }
  };

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const handleDeposit = async () => {
    try {
      console.log(amountInput);
      const amount = Number(amountInput);
      if (isNaN(amount) || amount <= 0) {
        console.log("Invalid amount");
        return;
      }
      const contract = await getContract();
      const tx = await contract.deposit(amount);
      const receipt = tx.wait();
      console.log("  Transaction successful", receipt);
      getBalance();
      resetInput();
    } catch (error) {
      console.log("Unable to deposit", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const amount = Number(amountInput);
      if (isNaN(amount) || amount <= 0) {
        console.log("Invalid amount");
        return;
      }
      const contract = await getContract();
      const tx = await contract.withdraw(amount);
      const receipt = tx.wait();
      console.log("  Transaction successful", receipt);
      getBalance();
      resetInput();
    } catch (error) {
      console.log("Unable to withdraw", error);
    }
  };

  const resetInput = () => {
    setAmountInput("");
  };

  return (
    <div>
      <h1>{balance}</h1>
      <p>Balance</p>

      <div>
        <input
          type="number"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
        />
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
}

export default App;
