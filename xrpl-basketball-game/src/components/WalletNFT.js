// src/components/WalletNFT.js
import { useState } from "react";
import * as xrpl from "xrpl";

export default function WalletNFT({ walletAddress }) {
  const [mintResult, setMintResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const mintNFT = async () => {
    console.log("Mint NFT clicked");
    console.log("Wallet address:", walletAddress);
    console.log("Crossmark available:", !!window.crossmark);

    if (!walletAddress) {
      alert("Connect your wallet first!");
      return;
    }

    if (!window.crossmark) {
      alert("Crossmark is not installed.");
      return;
    }

    setLoading(true);
    setMintResult(null);

    try {
      console.log("Creating transaction...");
      
      const tx = {
        TransactionType: "NFTokenMint",
        Account: walletAddress,
        URI: xrpl.convertStringToHex("ipfs://QmYourCIDHere"),
        Flags: 8, // tfTransferable
        NFTokenTaxon: 1,
        Fee: "12" // XRP drops (0.000012 XRP)
      };

      console.log("Transaction object:", tx);
      console.log("Requesting signature from Crossmark...");

      const result = await window.crossmark.xrpl.signAndSubmit(tx);

      console.log("Minted NFT successfully:", result);
      setMintResult(result);
      alert("NFT minted successfully!");

    } catch (err) {
      console.error("Crossmark mint failed:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        data: err.data
      });
      alert(`Minting failed: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <button
        onClick={mintNFT}
        disabled={loading || !walletAddress}
        className={`px-4 py-2 text-white rounded ${
          loading || !walletAddress
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {loading ? "Minting..." : "Mint NFT with Crossmark"}
      </button>

      {!walletAddress && (
        <p className="text-sm text-red-600">
          Please connect your wallet first
        </p>
      )}

      {mintResult && (
        <div className="w-full">
          <p className="text-green-600 font-semibold mb-2">✓ NFT Minted!</p>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
            {JSON.stringify(mintResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}