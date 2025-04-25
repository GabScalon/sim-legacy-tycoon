
import { Property as PropertyType } from "../types/game";
import Property from "./Property";

interface GameBoardProps {
  properties: PropertyType[];
  characterMoney: number;
  characterId: string;
  onBuyProperty: (propertyId: string) => void;
  onUpgradeProperty: (propertyId: string) => void;
}

const GameBoard = ({ 
  properties, 
  characterMoney, 
  characterId,
  onBuyProperty, 
  onUpgradeProperty 
}: GameBoardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Property Market</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Property
            key={property.id}
            property={property}
            canAfford={characterMoney >= (property.ownerId ? property.price * 0.3 : property.price)}
            isOwned={property.ownerId === characterId}
            onBuy={() => onBuyProperty(property.id)}
            onUpgrade={() => onUpgradeProperty(property.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
