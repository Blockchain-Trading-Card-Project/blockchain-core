// src/components/Card.js
export default function Card({ card }) {
  // Safety check - return null if card is undefined
  if (!card) {
    console.warn('Card component received undefined card');
    return null;
  }

  // Support both 'attributes' and 'stats' 
  const stats = card.attributes || card.stats || {};
  
  // Filter out 'total' if it exists
  const shooting = stats.shooting || 0;
  const passing = stats.passing || 0;
  const rebounding = stats.rebounding || 0;
  const defending = stats.defending || 0;
  const overall = shooting + passing + rebounding + defending;

  const rarityColors = {
    Common: 'from-slate-100 to-slate-200 border-slate-300',
    Rare: 'from-blue-100 to-blue-200 border-blue-400',
    Epic: 'from-purple-100 to-purple-200 border-purple-400',
    Legendary: 'from-orange-100 to-amber-200 border-orange-400'
  };

  const rarityBadge = {
    Common: 'bg-slate-600',
    Rare: 'bg-blue-600',
    Epic: 'bg-purple-600',
    Legendary: 'bg-gradient-to-r from-orange-600 to-amber-600'
  };

  const cardColor = rarityColors[card.rarity] || rarityColors.Common;
  const badgeColor = rarityBadge[card.rarity] || rarityBadge.Common;

  return (
    <div className={`bg-gradient-to-br ${cardColor} rounded-2xl shadow-lg border-2 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-xl text-slate-800 tracking-tight">
            {card.name || card.player || "Unknown"}
          </h3>
          <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-medium uppercase`}>
            {card.rarity || "Common"}
          </span>
        </div>

        {/* Stats */}
        {overall > 0 ? (
          <div className="space-y-3 bg-white/80 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Overall</span>
              <span className="text-2xl font-semibold text-blue-600 tabular-nums">{overall}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Shooting:</span>
                <span className="font-semibold text-slate-800 tabular-nums">{shooting}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Passing:</span>
                <span className="font-semibold text-slate-800 tabular-nums">{passing}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Rebounding:</span>
                <span className="font-semibold text-slate-800 tabular-nums">{rebounding}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Defending:</span>
                <span className="font-semibold text-slate-800 tabular-nums">{defending}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">Stats unavailable</p>
        )}

        {/* Date */}
        {card.date && (
          <p className="text-xs text-slate-600 mt-3 text-center">{card.date}</p>
        )}
      </div>

      {/* Token ID */}
      {card.tokenId && (
        <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-300 text-center font-mono">
          Token #{card.tokenId}
        </p>
      )}
    </div>
  );
}