// src/pages/home.js
import React from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

export default function Home() {
  const { walletAddress } = useWallet();

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span>NBA-Inspired Digital Collectibles</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Collect, Trade & Own
            </span>
            <br />
            <span className="text-blue-900">Basketball NFTs</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-800 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create custom basketball player cards with unique stats and rarities. Mint, collect, and trade on the blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {walletAddress ? (
              <>
                <Link
                  to="/mint"
                  className="px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Mint Your NFT 🏀
                </Link>
                <Link
                  to="/mycards"
                  className="px-8 py-4 bg-white text-blue-800 font-semibold rounded-xl hover:text-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  View My Collection
                </Link>
              </>
            ) : (
              <div className="text-center">
                <p className="text-blue-800 mb-4 font-medium">Connect your wallet to get started</p>
                <div className="px-8 py-4 bg-blue-100 text-blue-300 font-semibold rounded-xl cursor-not-allowed">
                  Connect Wallet First
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            { title: "Common Cards", desc: "Start your collection with Common cards. Perfect for beginners with balanced stats.", icon: "⚪", bg: "bg-gradient-to-br from-blue-200 to-blue-300" },
            { title: "Rare & Epic", desc: "Unlock higher stats and better attributes with Rare and Epic tier cards.", icon: "💎", bg: "bg-gradient-to-br from-blue-300 to-blue-400" },
            { title: "Legendary", desc: "The ultimate tier with maximum stats. Own the most powerful cards in the game.", icon: "👑", bg: "bg-gradient-to-br from-blue-400 to-blue-500" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className={`w-16 h-16 ${feature.bg} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">{feature.title}</h3>
              <p className="text-blue-800 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white rounded-2xl p-12 shadow-xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "5", label: "NBA Players" },
              { stat: "4", label: "Rarity Tiers" },
              { stat: "∞", label: "Unique Combos" },
              { stat: "1/day", label: "Mint Limit" }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {item.stat}
                </div>
                <div className="text-blue-800 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
