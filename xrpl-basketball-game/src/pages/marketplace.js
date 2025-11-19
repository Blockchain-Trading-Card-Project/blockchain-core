import React, { useEffect, useState } from "react";
import { Contract, parseEther, formatEther, BrowserProvider } from "ethers";
import BasketballNFTABI from "../abis/BasketballNFT.json";
import SimpleMarketplaceABI from "../abis/SimpleMarketplace.json";

const MARKETPLACE_ADDRESS = "0x8817Be15e01514dfD94989597e4745388c5B0dD0";

export default function EnhancedMarketplace() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [offers, setOffers] = useState({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");

  // Initialize provider, signer, and load listings
  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const _signer = await provider.getSigner();
          const address = await _signer.getAddress();
          setSigner(_signer);
          setUserAddress(address);
          await loadListings(_signer);
          loadOffersFromStorage();
        } catch (err) {
          console.error("Error connecting to MetaMask:", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    }
    init();
  }, []);

  // Filter listings when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter((listing) => {
        const metadata = listing.metadata || {};
        const name = (metadata.name || "").toLowerCase();
        const player = (metadata.player || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || player.includes(search);
      });
      setFilteredListings(filtered);
    }
  }, [searchTerm, listings]);

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
          
          // Fetch metadata from URI
          let metadata = {};
          try {
            const response = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
            metadata = await response.json();
          } catch (e) {
            console.warn("Could not fetch metadata for", uri);
          }

          loaded.push({
            id: i,
            seller: l.seller,
            nft: l.nft,
            tokenId: l.tokenId.toString(),
            price: formatEther(l.price),
            uri,
            metadata,
          });
        }
      }
      
      setListings(loaded);
      setFilteredListings(loaded);
    } catch (err) {
      console.error("Error loading listings:", err);
    }
  }

  // Load offers from localStorage
  function loadOffersFromStorage() {
    const stored = localStorage.getItem("marketplace_offers");
    if (stored) {
      setOffers(JSON.parse(stored));
    }
  }

  // Save offers to localStorage
  function saveOffersToStorage(newOffers) {
    localStorage.setItem("marketplace_offers", JSON.stringify(newOffers));
  }

  // Buy a listing directly
  async function buyListing(id, price) {
    if (!signer) return;
    try {
      const marketplace = new Contract(MARKETPLACE_ADDRESS, SimpleMarketplaceABI, signer);
      const tx = await marketplace.buy(id, { value: parseEther(price) });
      await tx.wait();
      alert("Purchase successful!");
      await loadListings(signer);
    } catch (err) {
      console.error("Error buying listing:", err);
      alert("Purchase failed. Check console for details.");
    }
  }

  // Open offer modal
  function openOfferModal(listing) {
    setSelectedListing(listing);
    setOfferAmount("");
    setShowOfferModal(true);
  }

  // Submit an offer
  function submitOffer() {
    if (!selectedListing || !offerAmount || parseFloat(offerAmount) <= 0) {
      alert("Please enter a valid offer amount");
      return;
    }

    const newOffer = {
      listingId: selectedListing.id,
      buyer: userAddress,
      amount: offerAmount,
      timestamp: Date.now(),
      status: "pending",
    };

    const listingOffers = offers[selectedListing.id] || [];
    const updatedOffers = {
      ...offers,
      [selectedListing.id]: [...listingOffers, newOffer],
    };

    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
    setShowOfferModal(false);
    alert("Offer submitted!");
  }

  // Get offers for a listing
  function getOffersForListing(listingId) {
    return offers[listingId] || [];
  }

  // Accept an offer (seller action)
  function acceptOffer(listingId, offerIndex) {
    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "accepted";
    
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
    alert("Offer accepted! (In production, this would trigger the smart contract transfer)");
  }

  // Decline an offer (seller action)
  function declineOffer(listingId, offerIndex) {
    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "declined";
    
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
    alert("Offer declined");
  }

  // Counter an offer (seller action)
  function counterOffer(listingId, offerIndex) {
    const counterAmount = prompt("Enter counter-offer amount (ETH):");
    if (!counterAmount || parseFloat(counterAmount) <= 0) return;

    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "countered";
    listingOffers[offerIndex].counterAmount = counterAmount;
    
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
    alert(`Counter-offer sent: ${counterAmount} ETH`);
  }

  // Cancel a listing
  async function cancelListing(id) {
    if (!signer) return;
    try {
      const marketplace = new Contract(MARKETPLACE_ADDRESS, SimpleMarketplaceABI, signer);
      const listing = await marketplace.getListing(id);
      
      if (userAddress.toLowerCase() !== listing.seller.toLowerCase()) {
        alert("You are not the seller of this listing");
        return;
      }

      const tx = await marketplace.cancel(id);
      await tx.wait();
      alert("Listing cancelled");
      await loadListings(signer);
    } catch (err) {
      console.error("Error cancelling listing:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🏀 Basketball Card Marketplace</h1>
        <p className="text-gray-600 mb-8">Search, buy, and make offers on basketball trading cards</p>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by player name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none text-lg shadow-sm"
          />
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 && (
          <p className="text-center text-gray-500 text-xl">No listings found</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const metadata = listing.metadata || {};
            const stats = metadata.attributes || metadata.stats || {};
            const listingOffers = getOffersForListing(listing.id);
            const isSeller = userAddress.toLowerCase() === listing.seller.toLowerCase();

            return (
              <div
                key={listing.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Card Image/Preview */}
                <div className="mb-4">
                  {metadata.image ? (
                    <img
                      src={metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                      alt={metadata.name || "NFT"}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                      {metadata.name || "NFT"}
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {metadata.name || metadata.player || `Token #${listing.tokenId}`}
                </h3>
                
                {metadata.rarity && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    metadata.rarity === 'Legendary' ? 'bg-orange-100 text-orange-800' :
                    metadata.rarity === 'Epic' ? 'bg-purple-100 text-purple-800' :
                    metadata.rarity === 'Rare' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {metadata.rarity}
                  </span>
                )}

                {/* Stats */}
                {(stats.shooting || stats.passing || stats.rebounding || stats.defending) && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Shooting: {stats.shooting || 0}</div>
                      <div>Passing: {stats.passing || 0}</div>
                      <div>Rebounding: {stats.rebounding || 0}</div>
                      <div>Defending: {stats.defending || 0}</div>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-indigo-600">{listing.price} ETH</p>
                  <p className="text-xs text-gray-500">Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</p>
                </div>

                {/* Action Buttons */}
                {!isSeller ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => buyListing(listing.id, listing.price)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => openOfferModal(listing)}
                      className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition font-semibold"
                    >
                      Make Offer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => cancelListing(listing.id)}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold"
                  >
                    Cancel Listing
                  </button>
                )}

                {/* Show Offers (for sellers) */}
                {isSeller && listingOffers.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">Offers ({listingOffers.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {listingOffers.map((offer, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">{offer.amount} ETH</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              offer.status === 'declined' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {offer.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            From: {offer.buyer.slice(0, 6)}...{offer.buyer.slice(-4)}
                          </p>
                          {offer.status === 'countered' && (
                            <p className="text-xs text-gray-600 mb-2">Counter: {offer.counterAmount} ETH</p>
                          )}
                          {offer.status === 'pending' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => acceptOffer(listing.id, idx)}
                                className="flex-1 bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => counterOffer(listing.id, idx)}
                                className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600"
                              >
                                Counter
                              </button>
                              <button
                                onClick={() => declineOffer(listing.id, idx)}
                                className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Make an Offer</h2>
            <p className="text-gray-600 mb-2">
              {selectedListing.metadata?.name}
            </p>
            <p className="text-gray-600 mb-4">
              Listing Price: <span className="font-bold">{selectedListing.price} ETH</span>
            </p>
            <input
              type="number"
              step="0.01"
              placeholder="Your offer amount (ETH)"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={submitOffer}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Submit Offer
              </button>
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}