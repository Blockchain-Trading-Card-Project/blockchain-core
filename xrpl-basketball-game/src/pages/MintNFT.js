import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";

// ------------------- SETTINGS -------------------
const fullPlayerPool = [
  { name: "LeBron James" }, { name: "Stephen Curry" }, { name: "Kevin Durant" },
  { name: "Giannis Antetokounmpo" }, { name: "Luka Doncic" }, { name: "Jayson Tatum" },
  { name: "Joel Embiid" }, { name: "Kawhi Leonard" }, { name: "Damian Lillard" },
  { name: "Anthony Davis" }, { name: "Nikola Jokic" }, { name: "Ja Morant" },
  { name: "Trae Young" }, { name: "Devin Booker" }, { name: "Jimmy Butler" },
];

const raritySettings = [
  { name: "Common", cost: 0.01, weight: 40, minTotal: 230, maxTotal: 250, minStat: 50, color: 'slate' },
  { name: "Rare", cost: 0.02, weight: 30, minTotal: 251, maxTotal: 280, minStat: 60, color: 'blue' },
  { name: "Epic", cost: 0.03, weight: 20, minTotal: 281, maxTotal: 320, minStat: 70, color: 'purple' },
  { name: "Legendary", cost: 0.04, weight: 10, minTotal: 321, maxTotal: 360, minStat: 80, color: 'orange' },
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
  return {
    [shuffledKeys[0]]: stats[0],
    [shuffledKeys[1]]: stats[1],
    [shuffledKeys[2]]: stats[2],
    [shuffledKeys[3]]: stats[3],
    total: stats.reduce((a, b) => a + b, 0),
  };
};

const pickRarityByStats = (total) => {
  const possible = raritySettings.filter(r => total >= r.minTotal && total <= r.maxTotal);
  if (possible.length === 0) return "Common";

  const totalWeight = possible.reduce((sum, r) => sum + r.weight, 0);
  const rnd = Math.random() * totalWeight;
  let acc = 0;
  for (const r of possible) {
    acc += r.weight;
    if (rnd <= acc) return r.name;
  }
  return possible[0].name;
};

// ------------------- PICK RARITY BY WEIGHT -------------------
const pickRarityByWeight = () => {
  const totalWeight = raritySettings.reduce((sum, r) => sum + r.weight, 0);
  const rnd = Math.random() * totalWeight;
  let acc = 0;
  for (const r of raritySettings) {
    acc += r.weight;
    if (rnd <= acc) return r.name;
  }
  return "Common"; // fallback
};

// ------------------- WALLET DROPS -------------------
const generateWalletDrops = (walletAddress) => {
  const lastDropsDate = localStorage.getItem(`dropsDate_${walletAddress}`);
  const today = new Date().toDateString();

  if (lastDropsDate === today) {
    const savedDrops = JSON.parse(localStorage.getItem(`drops_${walletAddress}`)) || [];
    return savedDrops.map(p => {
      if (!p.stats || !p.rarity) {
        const stats = generateStatsForRarity("Common");
        const rarity = pickRarityByStats(stats.total);
        return { ...p, stats, rarity };
      }
      return p;
    });
  }

  const shuffledPlayers = shuffleArray(fullPlayerPool).slice(0, 5);
  const drops = shuffledPlayers.map(player => {
    const rarity = pickRarityByWeight();        // ✅ pick rarity first
    const stats = generateStatsForRarity(rarity); // ✅ stats match rarity
    return { wallet: walletAddress, name: player.name, stats, rarity };
  });

  localStorage.setItem(`drops_${walletAddress}`, JSON.stringify(drops));
  localStorage.setItem(`dropsDate_${walletAddress}`, today);
  return drops;
};

// ------------------- MINT TIMER -------------------
const saveLastMintTime = (walletAddress) =>
  localStorage.setItem(`lastMint_${walletAddress}`, Date.now());

const getLastMintTime = (walletAddress) => {
  const time = localStorage.getItem(`lastMint_${walletAddress}`);
  return time ? parseInt(time) : null;
};

const canMintToday = (walletAddress) => {
  const lastMint = getLastMintTime(walletAddress);
  if (!lastMint) return true;
  return Date.now() - lastMint >= 24 * 60 * 60 * 1000;
};

// ------------------- COMPONENT -------------------
export default function MintNFT() {
  const { walletAddress } = useWallet();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState(null);

  useEffect(() => {
    if (walletAddress) {
      const drops = generateWalletDrops(walletAddress);
      setPlayers(drops);
      setSelectedPlayer(drops[0] || null);
    }
  }, [walletAddress]);

  // ------------------- MINT + MARKETPLACE -------------------
  const mintNFT = async () => {
    if (!walletAddress) return alert("Connect your wallet first!");
    //if (!canMintToday(walletAddress)) return alert("You can only mint 1 NFT per day.");
    if (!selectedPlayer) return alert("Select a player first!");
    if (!window.ethereum) return alert("Install MetaMask!");

    setMinting(true);
    setMintResult(null);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // ---- METADATA ----
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

      // ---- NFT CONTRACT ----
      const nftContractAddress = "0xA008B930a48D0f207113A943d2Dc86E4993065De";
      const nftABI = ["function mintNFT(address recipient, string memory tokenURI) public payable returns (uint256)"];
      const nftContract = new ethers.Contract(nftContractAddress, nftABI, signer);
      const costInWei = ethers.parseEther(raritySettings.find(r => r.name === selectedPlayer.rarity).cost.toString());

      const tx = await nftContract.mintNFT(walletAddress, metadataURI, { value: costInWei });
      const receipt = await tx.wait();

      // ---- LIST ON MARKETPLACE ----
      const marketplaceAddress = "0xe31D6Eee73235F203dEaFC8953f2F4553e71D3F0"; // <-- replace with your deployed marketplace
      const marketplaceABI = ["function listItem(address nftAddress, uint256 tokenId, uint256 price) public"];
      const marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);

      const tokenId = receipt.events[0].args[2]; // usually the tokenId from mint event
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
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-center mb-8">
          <h2 className="text-4xl font-semibold text-white mb-2 tracking-tight">Daily Player Drops</h2>
          <p className="text-blue-100 font-light tracking-tight">5 unique players daily • Stats determine rarity • Mint 1 per day</p>
        </div>

        {!walletAddress && (
          <div className="p-5 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center">
            <p className="text-yellow-800 font-medium tracking-tight">⚠️ Connect your wallet to see today's drops</p>
          </div>
        )}

        {walletAddress && players.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
            {/* Player Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">
                Select Player ({players.length} available today)
              </label>
              <select
                value={selectedPlayer?.name || ''}
                onChange={(e) => setSelectedPlayer(players.find(p => p.name === e.target.value))}
                className="w-full p-3.5 border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-slate-800 font-medium tracking-tight"
                disabled={minting}
              >
                {players.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} - {p.rarity} (Total: {p.stats?.total || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Mint Button */}
            <button
              onClick={mintNFT}
              disabled={minting || !selectedPlayer}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-lg rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed hover:scale-105 disabled:scale-100 tracking-tight"
            >
              {minting ? "Minting..." : "Mint NFT 🚀"}
            </button>

            {/* Result */}
            {mintResult && (
              <div className={`p-5 rounded-xl border ${mintResult.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                {mintResult.success ? (
                  <div>
                    <p className="font-semibold text-green-800 text-lg mb-2 tracking-tight">✅ Minted & Listed Successfully!</p>
                    <p className="text-sm text-green-700 mb-2 font-mono break-all">{mintResult.hash}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-red-800 text-lg mb-1 tracking-tight">❌ Mint Failed</p>
                    <p className="text-red-700 font-light">{mintResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
