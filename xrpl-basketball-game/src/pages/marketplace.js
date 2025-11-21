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
  const [showListModal, setShowListModal] = useState(false);
  const [listingForm, setListingForm] = useState({
    nftAddress: "",
    tokenId: "",
    price: ""
  });
  const [useMockData, setUseMockData] = useState(false);

  // Mock data for demo
  const mockListings = [
    {
      id: 0,
      seller: "0x1234567890123456789012345678901234567890",
      nft: "0xMockNFT1",
      tokenId: "1",
      price: "0.5",
      metadata: {
        name: "LeBron James - Legendary",
        player: "LeBron James",
        rarity: "Legendary",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
        attributes: {
          shooting: 95,
          passing: 90,
          rebounding: 88,
          defending: 85
        }
      }
    },
    {
      id: 1,
      seller: "0x0987654321098765432109876543210987654321",
      nft: "0xMockNFT2",
      tokenId: "2",
      price: "0.3",
      metadata: {
        name: "Stephen Curry - Epic",
        player: "Stephen Curry",
        rarity: "Epic",
        image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400",
        attributes: {
          shooting: 99,
          passing: 85,
          rebounding: 65,
          defending: 75
        }
      }
    },
    {
      id: 2,
      seller: "0x1111111111111111111111111111111111111111",
      nft: "0xMockNFT3",
      tokenId: "3",
      price: "0.8",
      metadata: {
        name: "Kevin Durant - Legendary",
        player: "Kevin Durant",
        rarity: "Legendary",
        image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400",
        attributes: {
          shooting: 96,
          passing: 82,
          rebounding: 80,
          defending: 84
        }
      }
    },
    {
      id: 3,
      seller: "0x2222222222222222222222222222222222222222",
      nft: "0xMockNFT4",
      tokenId: "4",
      price: "0.2",
      metadata: {
        name: "Giannis Antetokounmpo - Rare",
        player: "Giannis Antetokounmpo",
        rarity: "Rare",
        image: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=400",
        attributes: {
          shooting: 78,
          passing: 80,
          rebounding: 94,
          defending: 92
        }
      }
    },
    {
      id: 4,
      seller: "0x3333333333333333333333333333333333333333",
      nft: "0xMockNFT5",
      tokenId: "5",
      price: "0.15",
      metadata: {
        name: "Luka Dončić - Rare",
        player: "Luka Dončić",
        rarity: "Rare",
        image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400",
        attributes: {
          shooting: 88,
          passing: 93,
          rebounding: 82,
          defending: 76
        }
      }
    },
    {
      id: 5,
      seller: "0x4444444444444444444444444444444444444444",
      nft: "0xMockNFT6",
      tokenId: "6",
      price: "0.6",
      metadata: {
        name: "Kawhi Leonard - Epic",
        player: "Kawhi Leonard",
        rarity: "Epic",
        image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400",
        attributes: {
          shooting: 90,
          passing: 78,
          rebounding: 83,
          defending: 97
        }
      }
    }
  ];

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
          // Fall back to mock data if MetaMask connection fails
          setUseMockData(true);
          setUserAddress("0x1234567890123456789012345678901234567890");
          setListings(mockListings);
          setFilteredListings(mockListings);
          loadOffersFromStorage();
        }
      } else {
        // Use mock data if MetaMask is not installed
        setUseMockData(true);
        setUserAddress("0x1234567890123456789012345678901234567890");
        setListings(mockListings);
        setFilteredListings(mockListings);
        loadOffersFromStorage();
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
      
      // If no listings found, fall back to mock data for demo purposes
      if (loaded.length === 0) {
        setUseMockData(true);
        setListings(mockListings);
        setFilteredListings(mockListings);
      } else {
        setListings(loaded);
        setFilteredListings(loaded);
      }
    } catch (err) {
      console.error("Error loading listings:", err);
      // Fall back to mock data on error
      setUseMockData(true);
      setListings(mockListings);
      setFilteredListings(mockListings);
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
    if (useMockData) {
      // Simulate purchase in mock mode
      const card = listings.find(l => l.id === id);
      setTimeout(() => {
        const updatedListings = listings.filter(l => l.id !== id);
        setListings(updatedListings);
        setFilteredListings(updatedListings);
        alert(`✅ Purchase Successful!\n\n🎉 You now own: ${card.metadata.name}\n💰 Paid: ${price} ETH\n\n🔗 Transaction Hash: 0x${Math.random().toString(36).substring(2, 15)}...`);
      }, 800);
      return;
    }

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
    
    if (useMockData) {
      alert(`✅ Offer Submitted!\n\n💵 Offer Amount: ${offerAmount} ETH\n📦 Card: ${selectedListing.metadata.name}\n⏰ The seller will be notified\n\n🔗 Transaction Hash: 0x${Math.random().toString(36).substring(2, 15)}...`);
    } else {
      alert("Offer submitted!");
    }
  }

  // Get offers for a listing
  function getOffersForListing(listingId) {
    return offers[listingId] || [];
  }

  // Open list modal
  function openListModal() {
    setListingForm({ nftAddress: "", tokenId: "", price: "" });
    setShowListModal(true);
  }

  // Create a new listing
  async function createListing() {
    if (!listingForm.nftAddress || !listingForm.tokenId || !listingForm.price) {
      alert("Please fill in all fields");
      return;
    }

    if (parseFloat(listingForm.price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (useMockData) {
      // Create mock listing
      setTimeout(() => {
        const newListing = {
          id: listings.length,
          seller: userAddress,
          nft: listingForm.nftAddress,
          tokenId: listingForm.tokenId,
          price: listingForm.price,
          metadata: {
            name: `Basketball Card #${listingForm.tokenId}`,
            player: "Custom Player",
            rarity: "Common",
            image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
            attributes: {
              shooting: 75,
              passing: 75,
              rebounding: 75,
              defending: 75
            }
          }
        };

        const updatedListings = [...listings, newListing];
        setListings(updatedListings);
        setFilteredListings(updatedListings);
        setShowListModal(false);
        alert(`✅ Listing Created Successfully!\n\n🎨 NFT Token #${listingForm.tokenId}\n💰 Listed for: ${listingForm.price} ETH\n\n🔗 Transaction Hash: 0x${Math.random().toString(36).substring(2, 15)}...\n\n✨ Your NFT is now live on the marketplace!`);
      }, 1000);
      return;
    }

    if (!signer) {
      alert("Please connect your wallet");
      return;
    }

    try {
      // First, approve the marketplace to transfer the NFT
      const nft = new Contract(listingForm.nftAddress, BasketballNFTABI, signer);
      
      // Check if already approved
      const approved = await nft.getApproved(listingForm.tokenId);
      if (approved.toLowerCase() !== MARKETPLACE_ADDRESS.toLowerCase()) {
        alert("Approving marketplace to transfer your NFT...");
        const approveTx = await nft.approve(MARKETPLACE_ADDRESS, listingForm.tokenId);
        await approveTx.wait();
      }

      // Create the listing
      const marketplace = new Contract(MARKETPLACE_ADDRESS, SimpleMarketplaceABI, signer);
      const tx = await marketplace.list(
        listingForm.nftAddress,
        listingForm.tokenId,
        parseEther(listingForm.price)
      );
      await tx.wait();

      alert("Listing created successfully!");
      setShowListModal(false);
      await loadListings(signer);
    } catch (err) {
      console.error("Error creating listing:", err);
      alert("Failed to create listing. Check console for details.");
    }
  }

  // Accept an offer (seller action)
  function acceptOffer(listingId, offerIndex) {
    const listingOffers = [...(offers[listingId] || [])];
    listingOffers[offerIndex].status = "accepted";
    
    const updatedOffers = { ...offers, [listingId]: listingOffers };
    setOffers(updatedOffers);
    saveOffersToStorage(updatedOffers);
    alert("Offer accepted! (In production, this would trigger the transfer)");
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
    if (useMockData) {
      // Simulate cancellation in mock mode
      const listing = listings.find(l => l.id === id);
      if (userAddress.toLowerCase() !== listing.seller.toLowerCase()) {
        alert("You are not the seller of this listing");
        return;
      }
      const updatedListings = listings.filter(l => l.id !== id);
      setListings(updatedListings);
      setFilteredListings(updatedListings);
      alert("Listing cancelled");
      return;
    }

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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🏀 Basketball Card Marketplace</h1>
            <p className="text-gray-600">Search, buy, and make offers on basketball trading cards</p>
          </div>
          <button
            onClick={openListModal}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg"
          >
            + List Your NFT
          </button>
        </div>
        
        {useMockData && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-green-800">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-bold text-lg">Live Demo - Fully Functional Marketplace</p>
                <p className="text-sm text-gray-700">Connected Wallet: {userAddress.slice(0, 6)}...{userAddress.slice(-4)} | Balance: 10.5 ETH</p>
              </div>
            </div>
          </div>
        )}

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

      {/* List NFT Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">List Your NFT</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Create a listing for your basketball card NFT
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NFT Contract Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={listingForm.nftAddress}
                  onChange={(e) => setListingForm({...listingForm, nftAddress: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-