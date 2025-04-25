
import React from "react";

interface ActionPanelProps {
  onCollectRent: () => void;
  onRest: () => void;
  onAdvanceDay: () => void;
  energy: number;
  ownedPropertiesCount: number;
}

const ActionPanel = ({
  onCollectRent,
  onRest,
  onAdvanceDay,
  energy,
  ownedPropertiesCount,
}: ActionPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Actions</h2>
      
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={onCollectRent}
          disabled={ownedPropertiesCount === 0}
          className={`px-4 py-3 rounded text-white font-medium flex items-center justify-center ${
            ownedPropertiesCount > 0
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Collect Rent
          {ownedPropertiesCount > 0 && (
            <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              {ownedPropertiesCount} {ownedPropertiesCount === 1 ? "property" : "properties"}
            </span>
          )}
        </button>
        
        <button
          onClick={onRest}
          disabled={energy >= 100}
          className={`px-4 py-3 rounded text-white font-medium flex items-center justify-center ${
            energy < 100
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          Rest & Recover
          <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            +40 Energy
          </span>
        </button>
        
        <button
          onClick={onAdvanceDay}
          className="px-4 py-3 rounded bg-yellow-500 text-white font-medium hover:bg-yellow-600 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          End Day
        </button>
      </div>
    </div>
  );
};

export default ActionPanel;
