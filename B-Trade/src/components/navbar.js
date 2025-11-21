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
    <nav className="glass-card-dark border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
         <Link to="/" className="flex items-center space-x-4 group">
  <img
    src={Logo}
    alt="B-Trade Logo"
    className="w-12 h-12 rounded-xl shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300"
  />
  <span className="font-bold text-2xl tracking-tight gradient-text">
    B-Trade
  </span>
</Link>


          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-2">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  location.pathname === tab.path
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="ml-4">
            {walletAddress ? (
              <div className="flex items-center space-x-3 px-4 py-2.5 glass-card border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-mono text-sm font-medium text-emerald-400">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <button
                  onClick={() => setWalletAddress(null)}
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Mobile Links */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  location.pathname === tab.path
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}