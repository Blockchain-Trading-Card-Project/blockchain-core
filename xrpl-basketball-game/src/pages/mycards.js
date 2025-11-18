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

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-semibold text-slate-800 mb-2 tracking-tight">My Collection</h1>
            <p className="text-lg text-slate-600 font-light">
              {nfts.length} {nfts.length === 1 ? 'card' : 'cards'} owned
            </p>
          </div>
          <button
            onClick={fetchNFTs}
            disabled={loading || !walletAddress}
            className="px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md tracking-tight"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Refreshing...
              </span>
            ) : (
              '🔄 Refresh'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-medium tracking-tight">⚠️ {error}</p>
          </div>
        )}

        {/* Content */}
        {!walletAddress ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
                <span className="text-4xl">👛</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3 tracking-tight">Connect Wallet</h3>
              <p className="text-slate-600 font-light">
                Connect your wallet to view your NFT collection
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-20 bg-blue-50 rounded-2xl border border-blue-200">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
                <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3 tracking-tight">Loading Collection</h3>
              <p className="text-slate-600 font-light">
                Fetching your NFTs from the blockchain...
              </p>
            </div>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
                <span className="text-4xl">🏀</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3 tracking-tight">No Cards Yet</h3>
              <p className="text-slate-600 mb-6 font-light">
                Start building your collection by minting your first NFT
              </p>
              <a
                href="/mint"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 tracking-tight"
              >
                Mint Your First Card 🚀
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