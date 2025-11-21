import React, { useEffect, useState } from "react";

export default function EnhancedMarketplace() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [offers, setOffers] = useState({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [showListModal, setShowListModal] = useState(false);
  const [listingForm, setListingForm] = useState({
    nftAddress: "",
    tokenId: "",
    price: ""
  });

  const raritySettings = [
    { name: "Common", cost: 0.01, color: 'from-gray-500 to-gray-600', glow: 'shadow-gray-500/30' },
    { name: "Rare", cost: 0.02, color: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/30' },
    { name: "Epic", cost: 0.03, color: 'from-purple-500 to-pink-600', glow: 'shadow-purple-500/30' },
    { name: "Legendary", cost: 0.04, color: 'from-yellow-500 to-orange-600', glow: 'shadow-yellow-500/30' },
  ];

const mockListings = [
  {
    id: 0,
    seller: "DemoUser1",
    nft: "0xMockNFT1",
    tokenId: "1",
    price: "0.5",
    metadata: {
      name: "LeBron James",
      player: "LeBron James",
      rarity: "Legendary",
      attributes: { shooting: 95, passing: 90, rebounding: 88, defending: 85 }
    }
  },
  {
    id: 1,
    seller: "DemoUser2",
    nft: "0xMockNFT2",
    tokenId: "2",
    price: "0.3",
    metadata: {
      name: "Stephen Curry",
      player: "Stephen Curry",
      rarity: "Epic",
      attributes: { shooting: 99, passing: 85, rebounding: 65, defending: 75 }
    }
  },
  {
    id: 2,
    seller: "DemoUser3",
    nft: "0xMockNFT3",
    tokenId: "3",
    price: "0.35",
    metadata: {
      name: "Kevin Durant",
      player: "Kevin Durant",
      rarity: "Epic",
      attributes: { shooting: 94, passing: 82, rebounding: 78, defending: 77 }
    }
  },
  {
    id: 3,
    seller: "DemoUser4",
    nft: "0xMockNFT4",
    tokenId: "4",
    price: "0.45",
    metadata: {
      name: "Giannis Antetokounmpo",
      player: "Giannis Antetokounmpo",
      rarity: "Legendary",
      attributes: { shooting: 88, passing: 80, rebounding: 96, defending: 92 }
    }
  },
  {
    id: 4,
    seller: "DemoUser5",
    nft: "0xMockNFT5",
    tokenId: "5",
    price: "0.32",
    metadata: {
      name: "Luka Doncic",
      player: "Luka Doncic",
      rarity: "Epic",
      attributes: { shooting: 90, passing: 88, rebounding: 75, defending: 70 }
    }
  },
  {
    id: 5,
    seller: "DemoUser6",
    nft: "0xMockNFT6",
    tokenId: "6",
    price: "0.28",
    metadata: {
      name: "Jayson Tatum",
      player: "Jayson Tatum",
      rarity: "Rare",
      attributes: { shooting: 87, passing: 80, rebounding: 77, defending: 75 }
    }
  },
  {
    id: 6,
    seller: "DemoUser7",
    nft: "0xMockNFT7",
    tokenId: "7",
    price: "0.42",
    metadata: {
      name: "Joel Embiid",
      player: "Joel Embiid",
      rarity: "Legendary",
      attributes: { shooting: 85, passing: 70, rebounding: 95, defending: 90 }
    }
  },
  {
    id: 7,
    seller: "DemoUser8",
    nft: "0xMockNFT8",
    tokenId: "8",
    price: "0.36",
    metadata: {
      name: "Kawhi Leonard",
      player: "Kawhi Leonard",
      rarity: "Epic",
      attributes: { shooting: 88, passing: 78, rebounding: 82, defending: 93 }
    }
  },
  {
    id: 8,
    seller: "DemoUser9",
    nft: "0xMockNFT9",
    tokenId: "9",
    price: "0.31",
    metadata: {
      name: "Damian Lillard",
      player: "Damian Lillard",
      rarity: "Epic",
      attributes: { shooting: 92, passing: 85, rebounding: 68, defending: 70 }
    }
  },
  {
    id: 9,
    seller: "DemoUser10",
    nft: "0xMockNFT10",
    tokenId: "10",
    price: "0.38",
    metadata: {
      name: "Anthony Davis",
      player: "Anthony Davis",
      rarity: "Legendary",
      attributes: { shooting: 85, passing: 75, rebounding: 93, defending: 90 }
    }
  },
  {
    id: 10,
    seller: "DemoUser11",
    nft: "0xMockNFT11",
    tokenId: "11",
    price: "0.4",
    metadata: {
      name: "Nikola Jokic",
      player: "Nikola Jokic",
      rarity: "Legendary",
      attributes: { shooting: 90, passing: 95, rebounding: 90, defending: 78 }
    }
  },
  {
    id: 11,
    seller: "DemoUser12",
    nft: "0xMockNFT12",
    tokenId: "12",
    price: "0.34",
    metadata: {
      name: "Ja Morant",
      player: "Ja Morant",
      rarity: "Epic",
      attributes: { shooting: 88, passing: 87, rebounding: 70, defending: 72 }
    }
  },
  {
    id: 12,
    seller: "DemoUser13",
    nft: "0xMockNFT13",
    tokenId: "13",
    price: "0.33",
    metadata: {
      name: "Trae Young",
      player: "Trae Young",
      rarity: "Epic",
      attributes: { shooting: 91, passing: 88, rebounding: 65, defending: 68 }
    }
  },
  {
    id: 13,
    seller: "DemoUser14",
    nft: "0xMockNFT14",
    tokenId: "14",
    price: "0.29",
    metadata: {
      name: "Devin Booker",
      player: "Devin Booker",
      rarity: "Rare",
      attributes: { shooting: 89, passing: 82, rebounding: 68, defending: 70 }
    }
  },
  {
    id: 14,
    seller: "DemoUser15",
    nft: "0xMockNFT15",
    tokenId: "15",
    price: "0.37",
    metadata: {
      name: "Jimmy Butler",
      player: "Jimmy Butler",
      rarity: "Epic",
      attributes: { shooting: 85, passing: 80, rebounding: 75, defending: 88 }
    }
  }
];

  useEffect(() => {
    setListings(mockListings);
    setFilteredListings(mockListings);
    loadOffersFromStorage();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter(l => {
        const name = (l.metadata?.name || "").toLowerCase();
        const player = (l.metadata?.player || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || player.includes(search);
      });
      setFilteredListings(filtered);
    }
  }, [searchTerm, listings]);

  function loadOffersFromStorage() {
    const stored = localStorage.getItem("marketplace_offers");
    if (stored) setOffers(JSON.parse(stored));
  }

  function saveOffersToStorage(newOffers) {
    localStorage.setItem("marketplace_offers", JSON.stringify(newOffers));
  }

  function buyListing(id, price) {
    const card = listings.find(l => l.id === id);
    const updatedListings = listings.filter(l => l.id !== id);
    setListings(updatedListings);
    setFilteredListings(updatedListings);
  }

  function openOfferModal(listing) {
    setSelectedListing(listing);
    setOfferAmount("");
    setShowOfferModal(true);
  }

  function submitOffer() {
    if (!selectedListing || !offerAmount || parseFloat(offerAmount) <= 0) {
      return;
    }

    const newOffer = {
      listingId: selectedListing.id,
      buyer: userAddress || "Demo User",
      amount: offerAmount,
      timestamp: Date.now(),
      status: "pending"
    };
    const listingOffers = offers[selectedListing.id] || [];
    const updatedOffers = { ...offers, [selectedListing.id]: [...listingOffers, newOffer] };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
    setShowOfferModal(false);
  }

  function getOffersForListing(listingId) {
    return offers[listingId] || [];
  }

  function openListModal() {
    setListingForm({ nftAddress: "", tokenId: "", price: "" });
    setShowListModal(true);
  }

  function createListing() {
    if (!listingForm.nftAddress || !listingForm.tokenId || !listingForm.price) {
      return;
    }

    const newListing = {
      id: listings.length,
      seller: userAddress || "Demo User",
      nft: listingForm.nftAddress,
      tokenId: listingForm.tokenId,
      price: listingForm.price,
      metadata: {
        name: `Basketball Card #${listingForm.tokenId}`,
        player: "Custom Player",
        rarity: "Common",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
        attributes: { shooting: 75, passing: 75, rebounding: 75, defending: 75 }
      }
    };
    const updatedListings = [...listings, newListing];
    setListings(updatedListings);
    setFilteredListings(updatedListings);
    setShowListModal(false);
  }

  function cancelListing(id) {
    const updatedListings = listings.filter(l => l.id !== id);
    setListings(updatedListings);
    setFilteredListings(updatedListings);
  }

  function acceptOffer(listingId, offerIndex) {
    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "accepted";
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
  }

  function declineOffer(listingId, offerIndex) {
    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "declined";
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
  }

  function counterOffer(listingId, offerIndex) {
    const counterAmount = prompt("Enter counter-offer amount (ETH):");
    if (!counterAmount || parseFloat(counterAmount) <= 0) return;
    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "countered";
    listingOffers[offerIndex].counterAmount = counterAmount;
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="glass-card-dark p-8 text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-3">Basketball Card Marketplace</h1>
          <p className="text-gray-400">Buy and sell basketball NFT cards</p>
        </div>

        {/* Search and List Button */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by player name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          
          <button 
            onClick={openListModal}
            className="btn-primary rounded-xl whitespace-nowrap"
          >
            List Your NFT
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredListings.map((listing) => {
            const metadata = listing.metadata || {};
            const stats = metadata.attributes || {};
            const listingOffers = getOffersForListing(listing.id);
            const isSeller = listing.seller === userAddress;
            
            const rarityInfo = raritySettings.find(r => r.name === metadata.rarity) || raritySettings[0];
            const shooting = stats.shooting || 0;
            const passing = stats.passing || 0;
            const rebounding = stats.rebounding || 0;
            const defending = stats.defending || 0;
            const overall = Math.round((shooting + passing + rebounding + defending) / 4);

            return (
              <div 
                key={listing.id} 
                className={`relative rounded-2xl bg-gradient-to-br ${rarityInfo.color} p-0.5 hover:scale-105 transition-all duration-300 ${rarityInfo.glow} shadow-xl`}
              >
                <div className="glass-card-dark rounded-2xl p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-white">
                      {metadata.name || metadata.player || "Unknown"}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarityInfo.color} text-white shadow-lg`}>
                      {metadata.rarity || "Common"}
                    </span>
                  </div>

                  {/* Overall Rating Circle */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">{overall}</span>
                        <p className="text-xs text-gray-400 uppercase">OVR</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="glass-card p-3">
                      <p className="text-xs text-gray-400 uppercase mb-1">Shooting</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{shooting}</span>
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${rarityInfo.color}`}
                            style={{ width: `${(shooting / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-3">
                      <p className="text-xs text-gray-400 uppercase mb-1">Passing</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{passing}</span>
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${rarityInfo.color}`}
                            style={{ width: `${(passing / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-3">
                      <p className="text-xs text-gray-400 uppercase mb-1">Rebounding</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{rebounding}</span>
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${rarityInfo.color}`}
                            style={{ width: `${(rebounding / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-3">
                      <p className="text-xs text-gray-400 uppercase mb-1">Defending</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{defending}</span>
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${rarityInfo.color}`}
                            style={{ width: `${(defending / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Seller */}
                  <div className="mb-4 pb-4 border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">Price</span>
                      <span className="text-xl font-bold gradient-text">{listing.price} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Seller</span>
                      <span className="text-xs text-gray-300 font-mono">{listing.seller.slice(0, 8)}...</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isSeller ? (
                    <div className="space-y-2">
                      <button 
                        onClick={() => buyListing(listing.id, listing.price)}
                        className="w-full btn-primary rounded-xl"
                      >
                        Buy Now
                      </button>
                      <button 
                        onClick={() => openOfferModal(listing)}
                        className="w-full btn-secondary rounded-xl"
                      >
                        Make Offer
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => cancelListing(listing.id)}
                      className="w-full py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-all"
                    >
                      Cancel Listing
                    </button>
                  )}

                  {/* Offers Section */}
                  {isSeller && listingOffers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-white mb-3">
                        Offers ({listingOffers.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {listingOffers.map((offer, idx) => (
                          <div key={idx} className="glass-card p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold gradient-text">{offer.amount} ETH</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                offer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                offer.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                offer.status === 'declined' ? 'bg-red-500/20 text-red-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {offer.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">From: {offer.buyer}</p>
                            {offer.status === 'countered' && (
                              <p className="text-xs text-purple-400 mb-2">Counter: {offer.counterAmount} ETH</p>
                            )}
                            {offer.status === 'pending' && (
                              <div className="flex gap-2 mt-2">
                                <button 
                                  onClick={() => acceptOffer(listing.id, idx)}
                                  className="flex-1 bg-green-500/20 text-green-400 py-1.5 px-2 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => counterOffer(listing.id, idx)}
                                  className="flex-1 bg-blue-500/20 text-blue-400 py-1.5 px-2 rounded-lg text-xs font-semibold hover:bg-blue-500/30 transition"
                                >
                                  Counter
                                </button>
                                <button 
                                  onClick={() => declineOffer(listing.id, idx)}
                                  className="flex-1 bg-red-500/20 text-red-400 py-1.5 px-2 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition"
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && selectedListing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card-dark max-w-md w-full p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Make an Offer</h2>
            <p className="text-gray-300 mb-2">{selectedListing.metadata?.name}</p>
            <p className="text-gray-400 mb-6">
              Listing Price: <span className="gradient-text font-bold">{selectedListing.price} ETH</span>
            </p>
            <input
              type="number"
              step="0.01"
              placeholder="Your offer amount (ETH)"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all mb-6"
            />
            <div className="flex gap-3">
              <button 
                onClick={submitOffer} 
                className="flex-1 btn-primary rounded-xl"
              >
                Submit Offer
              </button>
              <button 
                onClick={() => setShowOfferModal(false)} 
                className="flex-1 py-3 glass-card border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List NFT Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card-dark max-w-md w-full p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">List Your NFT</h2>
            <input
              type="text"
              placeholder="NFT Address"
              value={listingForm.nftAddress}
              onChange={(e) => setListingForm({...listingForm, nftAddress: e.target.value})}
              className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all mb-3"
            />
            <input
              type="text"
              placeholder="Token ID"
              value={listingForm.tokenId}
              onChange={(e) => setListingForm({...listingForm, tokenId: e.target.value})}
              className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all mb-3"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price (ETH)"
              value={listingForm.price}
              onChange={(e) => setListingForm({...listingForm, price: e.target.value})}
              className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all mb-6"
            />
            <div className="flex gap-3">
              <button 
                onClick={createListing} 
                className="flex-1 btn-primary rounded-xl"
              >
                Create Listing
              </button>
              <button 
                onClick={() => setShowListModal(false)} 
                className="flex-1 py-3 glass-card border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
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