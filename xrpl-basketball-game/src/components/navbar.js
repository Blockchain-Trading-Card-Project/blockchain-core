import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import Logo from "../images/Screenshot 2025-11-18 164247.png";

export default function Navbar() {
  const location = useLocation();
  const { walletAddress, setWalletAddress } = useWallet();

  const tabs = [
    { name: "Home", path: "/" },
    { name: "My Cards", path: "/mycards" },
    { name: "Mint NFT", path: "/mint" },
    { name: "Marketplace", path: "/marketplace" },
  ];

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask!");
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

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
         <Link to="/" className="flex items-center space-x-4">
  <img
    src={Logo}
    alt="B-Trade Logo"
    className="w-12 h-12 rounded-2xl shadow-lg"
  />
  <span className="font-semibold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
    B-Trade
  </span>
</Link>


          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  location.pathname === tab.path
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="ml-4">
            {walletAddress ? (
              <div className="flex items-center space-x-2.5 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-sm font-medium text-slate-700">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Mobile Links */}
        <div className="md:hidden mt-4 flex justify-between items-center">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  location.pathname === tab.path
                    ? "bg-blue-500 text-white"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
          <div className="ml-2">
            {walletAddress ? (
              <div className="flex items-center space-x-2.5 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
