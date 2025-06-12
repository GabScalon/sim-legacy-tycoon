
import React from "react";

interface ActionPanelProps {
  onCollectRent: () => void;
  onRest: () => void;
  onAdvanceDay: () => void;
  onWork: () => void;
  energy: number;
  ownedPropertiesCount: number;
  businessSkill: number;
}

const ActionPanel = ({
  onCollectRent,
  onRest,
  onAdvanceDay,
  onWork,
  energy,
  ownedPropertiesCount,
  businessSkill,
}: ActionPanelProps) => {
  const workEarnings = 500 + (businessSkill * 10);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Ações</h2>
      
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={onWork}
          disabled={energy < 20}
          className={`px-4 py-3 rounded text-white font-medium flex items-center justify-center ${
            energy >= 20
              ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
              : "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h4a2 2 0 002-2V6" />
          </svg>
          Trabalhar
          <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            +${workEarnings}
          </span>
        </button>

        <button
          onClick={onCollectRent}
          disabled={ownedPropertiesCount === 0 || energy < 15}
          className={`px-4 py-3 rounded text-white font-medium flex items-center justify-center ${
            ownedPropertiesCount > 0 && energy >= 15
              ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              : "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Coletar Aluguel
          {ownedPropertiesCount > 0 && energy >= 15 && (
            <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              {ownedPropertiesCount} {ownedPropertiesCount === 1 ? "propriedade" : "propriedades"}
            </span>
          )}
          {energy < 15 && (
            <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              15 Energia
            </span>
          )}
        </button>
        
        <button
          onClick={onRest}
          disabled={energy >= 100}
          className={`px-4 py-3 rounded text-white font-medium flex items-center justify-center ${
            energy < 100
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          Descansar
          <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            +40 Energia
          </span>
        </button>
        
        <button
          onClick={onAdvanceDay}
          className="px-4 py-3 rounded bg-yellow-500 text-white font-medium hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Finalizar Dia
        </button>
      </div>
    </div>
  );
};

export default ActionPanel;
