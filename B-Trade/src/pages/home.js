// src/pages/home.js
import React from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

export default function Home() {
  const { walletAddress } = useWallet();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">

        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 glass-card px-8 py-4 rounded-full text-base font-semibold mb-8 min-w-[300px]">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="text-purple-300">NBA Player Card NFTs on Ethereum</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">
              Open Daily Packs
            </span>
            <br />
            <span className="text-white">Collect Basketball NFTs</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Each day reveals 5 random NBA players with unique stats. 
            Flip cards to discover rarities, choose your favorite, and mint it as an NFT on the blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {walletAddress ? (
              <>
                <Link
                  to="/mint"
                  className="btn-primary rounded-2xl flex items-center space-x-2"
                >
                  <span>Open Today's Pack</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </Link>

                <Link
                  to="/mycards"
                  className="btn-secondary rounded-2xl"
                >
                  My Collection
                </Link>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-300 mb-4 font-medium">Connect your wallet to start collecting</p>
                <div className="px-8 py-4 glass-card text-gray-500 font-semibold rounded-xl cursor-not-allowed opacity-50">
                  Connect Wallet First
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <p className="text-3xl font-bold gradient-text">5</p>
            <p className="text-gray-400 text-sm mt-1">Cards Per Pack</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-3xl font-bold gradient-text">15</p>
            <p className="text-gray-400 text-sm mt-1">NBA Players</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-3xl font-bold gradient-text">4</p>
            <p className="text-gray-400 text-sm mt-1">Rarity Tiers</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-3xl font-bold gradient-text">Daily</p>
            <p className="text-gray-400 text-sm mt-1">New Packs</p>
          </div>
        </div>

        {/* Pack Opening Experience */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">The Pack Opening Experience</h2>
          <div className="glass-card-dark p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Open Your Pack</h3>
                <p className="text-gray-400">Click to reveal 5 cards with glowing backs showing rarity hints</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Flip & Discover</h3>
                <p className="text-gray-400">Click each card to flip and reveal the player with their stats</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 mx-auto text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Choose & Mint</h3>
                <p className="text-gray-400">Select your favorite card and mint it as an NFT on Ethereum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rarity System */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Dynamic Rarity System</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Each card's rarity is determined by randomly generated stats. Higher overall ratings mean rarer cards!
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Common",
                desc: "Solid role players for your collection",
                color: "from-gray-500 to-gray-600",
                glowColor: "shadow-gray-500/30",
                stats: "60-70 OVR",
                cost: "0.01 ETH"
              },
              {
                title: "Rare",
                desc: "Quality starters with balanced skills",
                color: "from-blue-500 to-cyan-600",
                glowColor: "shadow-blue-500/30",
                stats: "71-80 OVR",
                cost: "0.02 ETH"
              },
              {
                title: "Epic",
                desc: "Star players with elite attributes",
                color: "from-purple-500 to-pink-600",
                glowColor: "shadow-purple-500/30",
                stats: "81-90 OVR",
                cost: "0.03 ETH"
              },
              {
                title: "Legendary",
                desc: "Superstar cards with max power",
                color: "from-yellow-500 to-orange-600",
                glowColor: "shadow-yellow-500/30",
                stats: "91-99 OVR",
                cost: "0.04 ETH"
              }
            ].map((tier, idx) => (
              <div key={idx} className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className={`h-2 w-full bg-gradient-to-r ${tier.color} rounded-full mb-6 ${tier.glowColor} shadow-lg`}></div>
                <h3 className="text-xl font-bold text-white mb-2">{tier.title}</h3>
                <p className="text-sm text-purple-300 font-semibold mb-1">{tier.stats}</p>
                <p className="text-xs gradient-text font-bold mb-3">{tier.cost}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Player Pool */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4">NBA Superstars Pool</h2>
          <p className="text-gray-400 text-center mb-12">15 elite players randomly appear in daily packs</p>

          <div className="glass-card-dark p-8">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[
                "LeBron James", "Stephen Curry", "Kevin Durant",
                "Giannis Antetokounmpo", "Luka Doncic", "Jayson Tatum",
                "Joel Embiid", "Kawhi Leonard", "Damian Lillard",
                "Anthony Davis", "Nikola Jokic", "Ja Morant",
                "Trae Young", "Devin Booker", "Jimmy Butler"
              ].map((player, idx) => (
                <div key={idx} className="glass-card p-3 text-center">
                  <p className="text-sm text-white font-medium">{player}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Categories */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Four Core Stats</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { stat: "Shooting", desc: "3-point accuracy and scoring ability" },
              { stat: "Passing", desc: "Playmaking and assist potential" },
              { stat: "Rebounding", desc: "Board control and second chances" },
              { stat: "Defending", desc: "Lockdown defense and steals" }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.stat}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Start Collecting in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                desc: "Link your MetaMask wallet to access your daily pack",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "Open & Choose",
                desc: "Open your pack, flip cards, and select your favorite player",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Mint & Collect",
                desc: "Mint your selection as an NFT and build your collection",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-8 text-center relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 text-8xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto text-white">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <div className="glass-card-dark p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Open Your First Pack?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join collectors opening packs daily. Each day brings new possibilities with random players and stats!
            </p>
            <Link to="/mint" className="btn-primary rounded-2xl inline-block">
              Open Today's Pack
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}