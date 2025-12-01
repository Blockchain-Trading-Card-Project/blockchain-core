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
  const [balance, setBalance] = useState("10.0"); // demo balance
  const [isConnected, setIsConnected] = useState(false);

  // Mock data
  const mockListings = [
    {
      id: 0,
      seller: "DemoUser1",
      nft: "0xMockNFT1",
      tokenId: "1",
      price: "0.5",
      metadata: {
        name: "LeBron James - Legendary",
        player: "LeBron James",
        rarity: "Legendary",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
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
        name: "Stephen Curry - Epic",
        player: "Stephen Curry",
        rarity: "Epic",
        image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400",
        attributes: { shooting: 99, passing: 85, rebounding: 65, defending: 75 }
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

  function connectWallet() {
    setIsConnected(true);
    setUserAddress("DemoUser");
    alert("Connected in demo mode!");
  }

  function disconnectWallet() {
    setIsConnected(false);
    setUserAddress("");
    alert("Disconnected demo wallet");
  }

  function loadOffersFromStorage() {
    const stored = localStorage.getItem("marketplace_offers");
    if (stored) setOffers(JSON.parse(stored));
  }

  function saveOffersToStorage(newOffers) {
    localStorage.setItem("marketplace_offers", JSON.stringify(newOffers));
  }

  function buyListing(id, price) {
    const card = listings.find(l => l.id === id);
    setTimeout(() => {
      alert(`✅ Purchase Successful (Demo)\nYou now own: ${card.metadata.name}\nPaid: ${price} ETH`);
      const updatedListings = listings.filter(l => l.id !== id);
      setListings(updatedListings);
      setFilteredListings(updatedListings);
    }, 500);
  }

  function openOfferModal(listing) {
    setSelectedListing(listing);
    setOfferAmount("");
    setShowOfferModal(true);
  }

  function submitOffer() {
    if (!selectedListing || !offerAmount || parseFloat(offerAmount) <= 0) {
      alert("Enter a valid offer");
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

    alert(`✅ Offer Submitted (Demo)\nAmount: ${offerAmount} ETH`);
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
      alert("Fill all fields");
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

    alert(`✅ Listing Created (Demo)\nToken #${listingForm.tokenId} listed for ${listingForm.price} ETH`);
    setShowListModal(false);
  }

  function cancelListing(id) {
    const updatedListings = listings.filter(l => l.id !== id);
    setListings(updatedListings);
    setFilteredListings(updatedListings);
    alert("Listing cancelled (Demo)");
  }

  function acceptOffer(listingId, offerIndex) {
    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "accepted";
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
    alert("Offer accepted (Demo)");
  }

  function declineOffer(listingId, offerIndex) {
    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "declined";
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
    alert("Offer declined (Demo)");
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
    alert(`Counter-offer sent: ${counterAmount} ETH`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🏀 Basketball Card Marketplace</h1>
            <p className="text-gray-600">Search, buy, and make offers on basketball trading cards</p>
          </div>
          <div className="flex gap-3">
            {!isConnected ? (
              <button onClick={connectWallet} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                🦊 Connect Wallet
              </button>
            ) : (
              <div className="bg-green-100 px-6 py-3 rounded-lg">
                <p className="text-green-800 font-semibold">✅ {userAddress}</p>
                <p className="text-green-700 text-sm">{balance} ETH</p>
                <button onClick={disconnectWallet} className="text-red-600 text-xs hover:underline mt-1">Disconnect</button>
              </div>
            )}
            <button onClick={openListModal} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold">+ List Your NFT</button>
          </div>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by player name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none text-lg shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const metadata = listing.metadata || {};
            const stats = metadata.attributes || {};
            const listingOffers = getOffersForListing(listing.id);
            const isSeller = listing.seller === userAddress;

            return (
              <div key={listing.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <img src={metadata.image} alt={metadata.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{metadata.name}</h3>
                {metadata.rarity && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    metadata.rarity === 'Legendary' ? 'bg-orange-100 text-orange-800' :
                    metadata.rarity === 'Epic' ? 'bg-purple-100 text-purple-800' :
                    metadata.rarity === 'Rare' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{metadata.rarity}</span>
                )}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm grid grid-cols-2 gap-2">
                  <div>Shooting: {stats.shooting || 0}</div>
                  <div>Passing: {stats.passing || 0}</div>
                  <div>Rebounding: {stats.rebounding || 0}</div>
                  <div>Defending: {stats.defending || 0}</div>
                </div>
                <p className="text-2xl font-bold text-indigo-600">{listing.price} ETH</p>
                <p className="text-xs text-gray-500 mb-2">Seller: {listing.seller}</p>

                {!isSeller ? (
                  <div className="space-y-2">
                    <button onClick={() => buyListing(listing.id, listing.price)} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold">Buy Now</button>
                    <button onClick={() => openOfferModal(listing)} className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition font-semibold">Make Offer</button>
                  </div>
                ) : (
                  <button onClick={() => cancelListing(listing.id)} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold">Cancel Listing</button>
                )}

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
                            }`}>{offer.status}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">From: {offer.buyer}</p>
                          {offer.status === 'countered' && <p className="text-xs text-gray-600 mb-2">Counter: {offer.counterAmount} ETH</p>}
                          {offer.status === 'pending' && (
                            <div className="flex gap-1">
                              <button onClick={() => acceptOffer(listing.id, idx)} className="flex-1 bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600">Accept</button>
                              <button onClick={() => counterOffer(listing.id, idx)} className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600">Counter</button>
                              <button onClick={() => declineOffer(listing.id, idx)} className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600">Decline</button>
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

      {showOfferModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Make an Offer</h2>
            <p className="text-gray-600 mb-2">{selectedListing.metadata?.name}</p>
            <p className="text-gray-600 mb-4">Listing Price: <span className="font-bold">{selectedListing.price} ETH</span></p>
            <input
              type="number"
              step="0.01"
              placeholder="Your offer amount (ETH)"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <button onClick={submitOffer} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold">Submit Offer</button>
              <button onClick={() => setShowOfferModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">List Your NFT</h2>
            <input
              type="text"
              placeholder="NFT Address"
              value={listingForm.nftAddress}
              onChange={(e) => setListingForm({...listingForm, nftAddress: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Token ID"
              value={listingForm.tokenId}
              onChange={(e) => setListingForm({...listingForm, tokenId: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price (ETH)"
              value={listingForm.price}
              onChange={(e) => setListingForm({...listingForm, price: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <button onClick={createListing} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold">Create Listing</button>
              <button onClick={() => setShowListModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
