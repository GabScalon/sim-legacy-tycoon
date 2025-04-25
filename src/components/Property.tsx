
import { Property as PropertyType } from "../types/game";

interface PropertyProps {
  property: PropertyType;
  canAfford: boolean;
  isOwned: boolean;
  onBuy: () => void;
  onUpgrade: () => void;
}

const Property = ({ property, canAfford, isOwned, onBuy, onUpgrade }: PropertyProps) => {
  const isUpgradeable = isOwned && property.level < 3;
  
  return (
    <div 
      className={`relative border rounded-lg p-4 h-full transition-all duration-200 ${
        isOwned 
          ? "border-green-500 bg-green-50" 
          : "border-gray-300 bg-white hover:shadow-md"
      }`}
    >
      <div className="absolute top-2 right-2">
        {property.type === "residential" ? (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Residential
          </span>
        ) : (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            Commercial
          </span>
        )}
      </div>

      <h3 className="font-bold mb-1 pr-20">{property.name}</h3>
      
      <div className="flex items-center mb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 mr-1 rounded-full ${
              i < property.level ? "bg-yellow-400" : "bg-gray-200"
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">Level {property.level}</span>
      </div>
      
      <div className="mb-2">
        <div className="text-sm text-gray-600">Value:</div>
        <div className="font-bold text-gray-900">${property.price.toLocaleString()}</div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-600">Monthly Rent:</div>
        <div className="font-bold text-green-600">${property.rent.toLocaleString()}</div>
      </div>
      
      <div className="flex flex-col space-y-2">
        {!isOwned && (
          <button
            onClick={onBuy}
            disabled={!canAfford}
            className={`px-4 py-2 rounded text-sm text-white font-medium ${
              canAfford 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Buy Property
          </button>
        )}
        
        {isUpgradeable && (
          <button
            onClick={onUpgrade}
            disabled={!canAfford}
            className={`px-4 py-2 rounded text-sm font-medium ${
              canAfford 
                ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Upgrade (${Math.floor(property.price * 0.3).toLocaleString()})
          </button>
        )}
      </div>
    </div>
  );
};

export default Property;
