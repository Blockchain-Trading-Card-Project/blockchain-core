import React from "react";
import { useWallet } from "../context/WalletContext";

export default function WalletConnectButton({ className = "btn-primary" }) {
  const { walletAddress, setWalletAddress } = useWallet();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Failed to connect wallet.");
    }
  };

  if (walletAddress) {
    return (
      <button className={className} onClick={() => setWalletAddress(null)}>
        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
      </button>
    );
  }

  return (
    <button onClick={connectWallet} className={className}>
      Connect Wallet
    </button>
  );
}
