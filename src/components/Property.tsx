
import { Property as PropertyType } from "../types/game";
import { House, Store } from "lucide-react";

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
          ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400" 
          : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 hover:shadow-md"
      }`}
    >
      <div className="absolute top-2 right-2">
        {property.type === "residential" ? (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <House className="h-3 w-3" />
            Residencial
          </span>
        ) : (
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Store className="h-3 w-3" />
            Comercial
          </span>
        )}
      </div>

      <h3 className="font-bold mb-1 pr-20 dark:text-white">{property.name}</h3>
      
      <div className="flex items-center mb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 mr-1 rounded-full ${
              i < property.level ? "bg-yellow-400" : "bg-gray-200 dark:bg-gray-600"
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Nível {property.level}</span>
      </div>
      
      <div className="mb-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">Valor:</div>
        <div className="font-bold text-gray-900 dark:text-white">${property.price.toLocaleString()}</div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-600 dark:text-gray-400">Aluguel Mensal:</div>
        <div className="font-bold text-green-600 dark:text-green-400">${property.rent.toLocaleString()}</div>
      </div>
      
      <div className="flex flex-col space-y-2">
        {!isOwned && (
          <button
            onClick={onBuy}
            disabled={!canAfford}
            className={`px-4 py-2 rounded text-sm text-white font-medium ${
              canAfford 
                ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" 
                : "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
            }`}
          >
            Comprar Propriedade
          </button>
        )}
        
        {isUpgradeable && (
          <button
            onClick={onUpgrade}
            disabled={!canAfford}
            className={`px-4 py-2 rounded text-sm font-medium ${
              canAfford 
                ? "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
            }`}
          >
            Melhorar (${Math.floor(property.price * 0.3).toLocaleString()})
          </button>
        )}
      </div>
    </div>
  );
};

export default Property;
