import React, { useEffect, useState } from "react";
import { Contract, parseEther, formatEther, BrowserProvider } from "ethers";
import BasketballNFTABI from "../abis/BasketballNFT.json";
import SimpleMarketplaceABI from "../abis/SimpleMarketplace.json";

const MARKETPLACE_ADDRESS = "0x8817Be15e01514dfD94989597e4745388c5B0dD0";

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [signer, setSigner] = useState(null);

  // Initialize provider, signer, and load listings
  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const _signer = await provider.getSigner();
          setSigner(_signer);
          await loadListings(_signer);
        } catch (err) {
          console.error("Error connecting to MetaMask:", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    }
    init();
  }, []);

  // Load all active listings from the marketplace contract
  async function loadListings(_signer) {
    try {
      const marketplace = new Contract(MARKETPLACE_ADDRESS, SimpleMarketplaceABI, _signer);
      const total = await marketplace.totalListings();
      const loaded = [];

      for (let i = 0; i < total; i++) {
        const l = await marketplace.getListing(i);
        if (l.active) {
          const nft = new Contract(l.nft, BasketballNFTABI, _signer);
          const uri = await nft.tokenURI(l.tokenId);
          loaded.push({
            id: i,
            seller: l.seller,
            nft: l.nft,
            tokenId: l.tokenId.toString(),
            price: formatEther(l.price),
            uri,
          });
        }
      }

      setListings(loaded);
    } catch (err) {
      console.error("Error loading listings:", err);
    }
  }

  // Buy a listing and refresh marketplace
  async function buyListing(id, price) {
    if (!signer) return;
    try {
      const marketplace = new Contract(MARKETPLACE_ADDRESS, SimpleMarketplaceABI, signer);
      const tx = await marketplace.buy(id, { value: parseEther(price) });
      await tx.wait();
      await loadListings(signer); // Refresh listings after purchase
    } catch (err) {
      console.error("Error buying listing:", err);
    }
  }

  // Optional: cancel a listing if the user is the seller
  async function cancelListing(id) {
    if (!signer) return;
    try {
      const marketplace = new Contract(MARKETPLACE_ADDRESS, SimpleMarketplaceABI, signer);
      const listing = await marketplace.getListing(id);
      const userAddress = await signer.getAddress();

      if (userAddress.toLowerCase() !== listing.seller.toLowerCase()) {
        alert("You are not the seller of this listing");
        return;
      }

      const tx = await marketplace.cancel(id);
      await tx.wait();
      await loadListings(signer); // Refresh listings after cancellation
    } catch (err) {
      console.error("Error cancelling listing:", err);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Marketplace</h1>
      {listings.length === 0 && <p>No active listings</p>}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {listings.map((l) => (
          <div key={l.id} style={{ border: "1px solid #ccc", padding: "1rem", width: "200px" }}>
            <img src={l.uri} alt={`NFT ${l.tokenId}`} style={{ width: "100%" }} />
            <p>Token ID: {l.tokenId}</p>
            <p>Seller: {l.seller}</p>
            <p>Price: {l.price} ETH</p>
            <button onClick={() => buyListing(l.id, l.price)}>Buy</button>
            <button
              style={{ marginTop: "0.5rem" }}
              onClick={() => cancelListing(l.id)}
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
