// src/components/WalletButton.js
import React from "react";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";

export default function WalletButton() {
  const { address, setAddress } = useWallet();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Failed to connect wallet.");
    }
  };

  return (
    <div>
      {address ? (
        <span className="px-4 py-2 bg-green-600 rounded">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Connect Metamask
        </button>
      )}
    </div>
  );
}
