// src/components/CardGrid.js
import Card from "./Card";

export default function CardGrid({ cards }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No cards to display</p>
      </div>
    );
  }

  // Filter out any undefined/null cards
  const validCards = cards.filter(card => card != null);

  if (validCards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No valid cards to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {validCards.map((card, i) => (
        <Card key={card.tokenId || i} card={card} />
      ))}
    </div>
  );
}