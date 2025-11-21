import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import Logo from "../images/Screenshot 2025-11-18 164247.png";

// ------------------- SETTINGS -------------------
const fullPlayerPool = [
  { name: "LeBron James" }, { name: "Stephen Curry" }, { name: "Kevin Durant" },
  { name: "Giannis Antetokounmpo" }, { name: "Luka Doncic" }, { name: "Jayson Tatum" },
  { name: "Joel Embiid" }, { name: "Kawhi Leonard" }, { name: "Damian Lillard" },
  { name: "Anthony Davis" }, { name: "Nikola Jokic" }, { name: "Ja Morant" },
  { name: "Trae Young" }, { name: "Devin Booker" }, { name: "Jimmy Butler" },
];

const raritySettings = [
  { name: "Common", cost: 0.01, weight: 40, minTotal: 230, maxTotal: 250, minStat: 50, color: 'from-gray-500 to-gray-600', glow: 'shadow-gray-500/50', glowAnimation: 'shadow-gray-500' },
  { name: "Rare", cost: 0.02, weight: 30, minTotal: 251, maxTotal: 280, minStat: 60, color: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/50', glowAnimation: 'shadow-blue-500' },
  { name: "Epic", cost: 0.03, weight: 20, minTotal: 281, maxTotal: 320, minStat: 70, color: 'from-purple-500 to-pink-600', glow: 'shadow-purple-500/50', glowAnimation: 'shadow-purple-500' },
  { name: "Legendary", cost: 0.04, weight: 10, minTotal: 321, maxTotal: 360, minStat: 80, color: 'from-yellow-500 to-orange-600', glow: 'shadow-yellow-500/50', glowAnimation: 'shadow-yellow-500' },
];

// ------------------- HELPERS -------------------
const shuffleArray = (arr) =>
  arr.map((a) => ({ sort: Math.random(), value: a }))
     .sort((a, b) => a.sort - b.sort)
     .map((a) => a.value);

const generateStatsForRarity = (rarity) => {
  const settings = raritySettings.find(r => r.name === rarity) || raritySettings[0];
  const { minTotal, maxTotal, minStat } = settings;
  const total = Math.floor(Math.random() * (maxTotal - minTotal + 1)) + minTotal;

  let stats = [minStat, minStat, minStat, minStat];
  let remaining = total - minStat * 4;

  for (let i = 0; i < 4; i++) {
    const add = i < 3 ? Math.floor(Math.random() * (remaining + 1)) : remaining;
    stats[i] += add;
    remaining -= add;
  }

  const shuffledKeys = shuffleArray(["shooting", "passing", "rebounding", "defending"]);
  const statObj = {
    [shuffledKeys[0]]: stats[0],
    [shuffledKeys[1]]: stats[1],
    [shuffledKeys[2]]: stats[2],
    [shuffledKeys[3]]: stats[3],
  };
  statObj.total = Math.round(stats.reduce((a, b) => a + b, 0) / stats.length); // Average instead of total sum
  return statObj;
};

const pickRarityByWeight = () => {
  const totalWeight = raritySettings.reduce((sum, r) => sum + r.weight, 0);
  const rnd = Math.random() * totalWeight;
  let acc = 0;
  for (const r of raritySettings) {
    acc += r.weight;
    if (rnd <= acc) return r.name;
  }
  return "Common";
};

// ------------------- WALLET DROPS -------------------
const generateWalletDrops = (walletAddress) => {
  const lastDropsDate = localStorage.getItem(`dropsDate_${walletAddress}`);
  const today = new Date().toDateString();

  if (lastDropsDate === today) {
    const savedDrops = JSON.parse(localStorage.getItem(`drops_${walletAddress}`)) || [];
    return savedDrops.map(p => {
      if (!p.stats || !p.rarity) {
        const rarity = pickRarityByWeight();
        const stats = generateStatsForRarity(rarity);
        return { ...p, stats, rarity };
      }
      return p;
    });
  }

  const shuffledPlayers = shuffleArray(fullPlayerPool).slice(0, 5);
  const drops = shuffledPlayers.map(player => {
    const rarity = pickRarityByWeight();
    const stats = generateStatsForRarity(rarity);
    return { wallet: walletAddress, name: player.name, stats, rarity };
  });

  localStorage.setItem(`drops_${walletAddress}`, JSON.stringify(drops));
  localStorage.setItem(`dropsDate_${walletAddress}`, today);
  return drops;
};

// ------------------- MINT TIMER -------------------
const saveLastMintTime = (walletAddress) =>
  localStorage.setItem(`lastMint_${walletAddress}`, Date.now());

// ------------------- COMPONENT -------------------
export default function MintNFT() {
  const { walletAddress } = useWallet();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [packOpened, setPackOpened] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const [allCardsFlipped, setAllCardsFlipped] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      const drops = generateWalletDrops(walletAddress);
      setPlayers(drops);
      setFlippedCards(new Array(drops.length).fill(false));
    }
  }, [walletAddress]);

  const openPack = () => {
    setPackOpened(true);
    players.forEach((_, index) => {
      setTimeout(() => {
        const element = document.getElementById(`card-${index}`);
        if (element) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) scale(1)';
        }
      }, index * 200);
    });
  };

  const flipCard = (index) => {
    if (flippedCards[index]) return;
    const newFlipped = [...flippedCards];
    newFlipped[index] = true;
    setFlippedCards(newFlipped);
    if (newFlipped.every(f => f)) setAllCardsFlipped(true);
  };

  const flipAllCards = () => {
    setFlippedCards(new Array(players.length).fill(true));
    setAllCardsFlipped(true);
  };

  const selectCard = (player) => setSelectedPlayer(player);

  const mintNFT = async () => {
    if (!walletAddress) return alert("Connect your wallet first!");
    if (!selectedPlayer) return alert("Select a player first!");
    if (!window.ethereum) return alert("Install MetaMask!");

    setMinting(true);
    setMintResult(null);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const metadata = {
        name: `${selectedPlayer.name} - ${selectedPlayer.rarity}`,
        player: selectedPlayer.name,
        rarity: selectedPlayer.rarity,
        date: new Date().toDateString(),
        attributes: selectedPlayer.stats,
        image: "https://via.placeholder.com/300",
      };
      const metadataBase64 = btoa(JSON.stringify(metadata));
      const metadataURI = `data:application/json;base64,${metadataBase64}`;

      const nftContractAddress = "0xA008B930a48D0f207113A943d2Dc86E4993065De";
      const nftABI = ["function mintNFT(address recipient, string memory tokenURI) public payable returns (uint256)"];
      const nftContract = new ethers.Contract(nftContractAddress, nftABI, signer);
      const costInWei = ethers.parseEther(raritySettings.find(r => r.name === selectedPlayer.rarity).cost.toString());

      const tx = await nftContract.mintNFT(walletAddress, metadataURI, { value: costInWei });
      const receipt = await tx.wait();

      const marketplaceAddress = "0xe31D6Eee73235F203dEaFC8953f2F4553e71D3F0";
      const marketplaceABI = ["function listItem(address nftAddress, uint256 tokenId, uint256 price) public"];
      const marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);

      const tokenId = receipt.events[0].args[2];
      await marketplaceContract.listItem(nftContractAddress, tokenId, costInWei);

      setMintResult({ success: true, hash: receipt.transactionHash, blockNumber: receipt.blockNumber });
      saveLastMintTime(walletAddress);
    } catch (err) {
      console.error(err);
      let errorMessage = "Minting failed";
      if (err.code === "ACTION_REJECTED") errorMessage = "Transaction rejected";
      else if (err.message?.includes("insufficient funds")) errorMessage = "Insufficient funds";
      setMintResult({ success: false, error: errorMessage });
    } finally {
      setMinting(false);
    }
  };

  const currentRarity = selectedPlayer ? raritySettings.find(r => r.name === selectedPlayer.rarity) : null;

  // ------------------- JSX -------------------
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="glass-card-dark p-8 text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-3">Daily Pack Opening</h1>
          <p className="text-gray-400">Open your daily pack to reveal 5 unique players</p>
        </div>

        {!walletAddress && (
          <div className="glass-card border border-yellow-500/30 p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-yellow-400 font-medium">Connect your wallet to open today's pack</p>
          </div>
        )}

        {walletAddress && !packOpened && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="glass-card-dark p-12 text-center animate-float">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <img src={Logo} alt="B-Trade" className="w-20 h-20 rounded-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Open Your Pack?</h2>
              <p className="text-gray-400 mb-8">Click to reveal 5 basketball player cards</p>
              <button
                onClick={openPack}
                className="btn-primary text-lg px-8"
              >
                Open Pack
              </button>
            </div>
          </div>
        )}

        {walletAddress && packOpened && (
          <>
            {/* Cards Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Pack</h2>
                {!allCardsFlipped && (
                  <button
                    onClick={flipAllCards}
                    className="btn-secondary text-sm"
                  >
                    Reveal All Cards
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {players.map((player, index) => {
                  const rarityInfo = raritySettings.find(r => r.name === player.rarity);
                  const isSelected = selectedPlayer?.name === player.name;

                  return (
                    <div
                      key={index}
                      id={`card-${index}`}
                      className="relative h-80 opacity-0 transform translate-y-10 scale-95 transition-all duration-500"
                      style={{ transitionDelay: `${index * 100}ms`, perspective: '1000px' }}
                    >
                      <div
                        className={`absolute inset-0 transition-transform duration-700 cursor-pointer ${flippedCards[index] ? '[transform:rotateY(180deg)]' : ''} ${isSelected && allCardsFlipped ? 'ring-4 ring-purple-500 rounded-2xl' : ''}`}
                        onClick={() => !flippedCards[index] ? flipCard(index) : allCardsFlipped && selectCard(player)}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Card Back */}
                        <div
                          className={`absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 flex flex-col items-center justify-center p-4 ${rarityInfo.glow} shadow-2xl`}
                        >
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${rarityInfo.color} opacity-20 animate-pulse`}></div>
                          <img src={Logo} alt="B-Trade" className="w-16 h-16 rounded-xl mb-4 relative z-10" />
                          <p className="text-white font-bold text-lg relative z-10">B-Trade</p>
                          <p className="text-gray-400 text-xs mt-2 relative z-10">Click to reveal</p>
                        </div>

                        {/* Card Front */}
                        <div
                          className={`absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl bg-gradient-to-br ${rarityInfo.color} p-0.5`}
                        >
                          <div className="glass-card-dark rounded-2xl p-4 h-full flex flex-col">
                            <div className="text-center mb-3">
                              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mb-2">
                                <span className="text-2xl font-bold text-white">
                                  {player.stats.total} {/* Now shows average */}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-white mb-1 truncate">{player.name}</h3>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${rarityInfo.color} text-white`}>
                                {player.rarity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mint Section */}
            {allCardsFlipped && (
              <div className="glass-card-dark p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Selected Card Display */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Selected Card</h3>
                    {selectedPlayer ? (
                      <div className={`relative rounded-2xl bg-gradient-to-br ${currentRarity.color} p-1`}>
                        <div className="glass-card-dark rounded-2xl p-6">
                          <div className="text-center mb-6">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mb-4">
                              <span className="text-4xl font-bold text-white">
                                {selectedPlayer.stats.total}
                              </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{selectedPlayer.name}</h2>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${currentRarity.color} text-white`}>
                              {selectedPlayer.rarity}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(selectedPlayer.stats).filter(([key]) => key !== 'total').map(([stat, value]) => (
                              <div key={stat} className="glass-card p-3">
                                <p className="text-xs text-gray-400 uppercase mb-1">{stat}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xl font-bold text-white">{value}</span>
                                  <div className="w-16 bg-gray-700 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full bg-gradient-to-r ${currentRarity.color}`}
                                      style={{ width: `${(value / 100) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Mint Cost</span>
                              <span className="text-xl font-bold gradient-text">
                                {currentRarity.cost} ETH
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-card p-12 text-center">
                        <p className="text-gray-400">Select a card to mint</p>
                      </div>
                    )}
                  </div>

                  {/* Mint Controls */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Mint Your NFT</h3>
                      <p className="text-gray-400 mb-6">
                        Once minted, your card will be added to your collection and listed on the marketplace.
                      </p>

                      <button
                        onClick={mintNFT}
                        disabled={minting || !selectedPlayer}
                        className={`w-full py-4 font-semibold text-lg rounded-xl transition-all duration-300 ${
                          minting || !selectedPlayer
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                      >
                        {minting ? (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="spinner"></div>
                            <span>Minting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <span>Mint NFT</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    </div>

                    {mintResult && (
                      <div className={`glass-card p-6 border ${
                        mintResult.success ? 'border-emerald-500/30' : 'border-red-500/30'
                      }`}>
                        {mintResult.success ? (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="font-semibold text-emerald-400 text-lg">Success!</p>
                            </div>
                            <p className="text-xs text-gray-500 font-mono break-all">{mintResult.hash}</p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                              <p className="font-semibold text-red-400 text-lg">Failed</p>
                            </div>
                            <p className="text-red-300">{mintResult.error}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
