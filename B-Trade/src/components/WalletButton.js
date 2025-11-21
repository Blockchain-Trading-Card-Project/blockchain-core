// src/components/WalletButton.js
import React from "react";
import { useWallet } from "../context/WalletContext";

export default function WalletButton() {
  const { walletAddress, setWalletAddress } = useWallet();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Failed to connect wallet.");
    }
  };

  return (
    <div>
      {walletAddress ? (
        <span className="px-4 py-2 bg-green-600 rounded">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </span>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
