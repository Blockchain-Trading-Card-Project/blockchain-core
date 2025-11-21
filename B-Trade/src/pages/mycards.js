// src/pages/MyCards.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import CardGrid from "../components/CardGrid";

export default function MyCards() {
  const { walletAddress } = useWallet();
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNFTs = async () => {
    if (!walletAddress) {
      setError("Please connect your wallet");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractAddress = "0xA008B930a48D0f207113A943d2Dc86E4993065De";
      
      const contractABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
        "function tokenURI(uint256 tokenId) view returns (string)",
        "function ownerOf(uint256 tokenId) view returns (address)",
      ];

      const nftContract = new ethers.Contract(contractAddress, contractABI, provider);
      
      console.log("Fetching NFTs for:", walletAddress);
      
      const balance = await nftContract.balanceOf(walletAddress);
      const numNFTs = Number(balance);
      
      console.log("Number of NFTs owned:", numNFTs);

      if (numNFTs === 0) {
        setNFTs([]);
        setLoading(false);
        return;
      }

      const parsedNFTs = [];

      for (let i = 0; i < numNFTs; i++) {
        try {
          const tokenId = await nftContract.tokenOfOwnerByIndex(walletAddress, i);
          const tokenURI = await nftContract.tokenURI(tokenId);
          
          let metadata = {};
          
          if (tokenURI.startsWith("data:application/json;base64,")) {
            const base64Data = tokenURI.replace("data:application/json;base64,", "");
            const jsonString = atob(base64Data);
            metadata = JSON.parse(jsonString);
          } else if (tokenURI.startsWith("ipfs://")) {
            const ipfsHash = tokenURI.replace("ipfs://", "");
            const httpURI = `https://ipfs.io/ipfs/${ipfsHash}`;
            const response = await fetch(httpURI);
            metadata = await response.json();
          } else if (tokenURI.startsWith("http")) {
            const response = await fetch(tokenURI);
            metadata = await response.json();
          } else {
            try {
              metadata = JSON.parse(tokenURI);
            } catch {
              metadata = { name: "Unknown NFT", tokenId: tokenId.toString() };
            }
          }

          parsedNFTs.push({
            ...metadata,
            tokenId: tokenId.toString(),
          });
        } catch (err) {
          console.error(`Error fetching NFT at index ${i}:`, err);
        }
      }

      console.log("All NFTs:", parsedNFTs);
      setNFTs(parsedNFTs);
    } catch (err) {
      console.error("Fetching NFTs failed:", err);
      setError(`Failed to fetch NFTs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchNFTs();
    }
  }, [walletAddress]);

  // Calculate collection stats
  const getCollectionStats = () => {
    if (nfts.length === 0) return { common: 0, rare: 0, epic: 0, legendary: 0 };
    
    const stats = {
      common: nfts.filter(nft => nft.rarity === 'Common').length,
      rare: nfts.filter(nft => nft.rarity === 'Rare').length,
      epic: nfts.filter(nft => nft.rarity === 'Epic').length,
      legendary: nfts.filter(nft => nft.rarity === 'Legendary').length,
    };
    return stats;
  };

  const stats = getCollectionStats();

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="glass-card-dark p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">My Collection</h1>
              <p className="text-lg text-gray-400">
                {nfts.length} {nfts.length === 1 ? 'card' : 'cards'} owned
              </p>
            </div>
            <button
              onClick={fetchNFTs}
              disabled={loading || !walletAddress}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="spinner"></div>
                  Refreshing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </span>
              )}
            </button>
          </div>

          {/* Collection Stats */}
          {nfts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-gray-400">{stats.common}</p>
                <p className="text-xs text-gray-500 uppercase">Common</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{stats.rare}</p>
                <p className="text-xs text-gray-500 uppercase">Rare</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stats.epic}</p>
                <p className="text-xs text-gray-500 uppercase">Epic</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{stats.legendary}</p>
                <p className="text-xs text-gray-500 uppercase">Legendary</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card border border-red-500/30 p-6 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!walletAddress ? (
          <div className="glass-card-dark py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-purple-500/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Connect Wallet</h3>
              <p className="text-gray-400">
                Connect your wallet to view your NFT collection
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="glass-card-dark py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-5">
                <div className="spinner w-10 h-10"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Loading Collection</h3>
              <p className="text-gray-400">
                Fetching your NFTs from the blockchain...
              </p>
            </div>
          </div>
        ) : nfts.length === 0 ? (
          <div className="glass-card-dark py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-500/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Cards Yet</h3>
              <p className="text-gray-400 mb-6">
                Start building your collection by minting your first NFT
              </p>
              <a
                href="/mint"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Mint Your First Card</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <CardGrid cards={nfts} />
        )}
      </div>
    </div>
  );
}