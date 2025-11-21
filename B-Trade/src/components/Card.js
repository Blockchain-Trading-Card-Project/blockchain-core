// src/components/Card.js
export default function Card({ card }) {
  // Safety check - return null if card is undefined
  if (!card) {
    console.warn('Card component received undefined card');
    return null;
  }

  // Support both 'attributes' and 'stats' 
  const stats = card.attributes || card.stats || {};
  
  // Get individual stats
  const shooting = stats.shooting || 0;
  const passing = stats.passing || 0;
  const rebounding = stats.rebounding || 0;
  const defending = stats.defending || 0;
  
  // Calculate overall as average if not provided
  const overall = stats.overall || Math.round((shooting + passing + rebounding + defending) / 4);

  const rarityColors = {
    Common: 'from-gray-500 to-gray-600',
    Rare: 'from-blue-500 to-cyan-600',
    Epic: 'from-purple-500 to-pink-600',
    Legendary: 'from-yellow-500 to-orange-600'
  };

  const rarityGlow = {
    Common: 'shadow-gray-500/30',
    Rare: 'shadow-blue-500/30',
    Epic: 'shadow-purple-500/30',
    Legendary: 'shadow-yellow-500/30'
  };

  const cardColor = rarityColors[card.rarity] || rarityColors.Common;
  const glowEffect = rarityGlow[card.rarity] || rarityGlow.Common;

  return (
    <div className={`relative rounded-2xl bg-gradient-to-br ${cardColor} p-0.5 hover:scale-105 transition-all duration-300 ${glowEffect} shadow-xl`}>
      <div className="glass-card-dark rounded-2xl p-6 h-full flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-xl text-white">
              {card.name || card.player || "Unknown"}
            </h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${cardColor} text-white shadow-lg`}>
              {card.rarity || "Common"}
            </span>
          </div>

          {/* Overall Rating Circle */}
          {overall > 0 && (
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">{overall}</span>
                  <p className="text-xs text-gray-400 uppercase">OVR</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          {overall > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3">
                <p className="text-xs text-gray-400 uppercase mb-1">Shooting</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{shooting}</span>
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${cardColor}`}
                      style={{ width: `${((shooting - 60) / 39) * 100}%` }}
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
                      className={`h-2 rounded-full bg-gradient-to-r ${cardColor}`}
                      style={{ width: `${((passing - 60) / 39) * 100}%` }}
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
                      className={`h-2 rounded-full bg-gradient-to-r ${cardColor}`}
                      style={{ width: `${((rebounding - 60) / 39) * 100}%` }}
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
                      className={`h-2 rounded-full bg-gradient-to-r ${cardColor}`}
                      style={{ width: `${((defending - 60) / 39) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500">Stats unavailable</p>
            </div>
          )}

          {/* Date */}
          {card.date && (
            <p className="text-xs text-gray-500 mt-4 text-center">{card.date}</p>
          )}
        </div>

        {/* Token ID */}
        {card.tokenId && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center font-mono">
              Token #{card.tokenId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}