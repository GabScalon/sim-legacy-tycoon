
import { Character as CharacterType } from "../types/game";
import { calculateFriendLevel } from "../utils/gameLogic";

interface CharacterProps {
  character: CharacterType;
  onCharacterCreated: (name: string) => void;
}

const Character = ({ character }: CharacterProps) => {
  const friendLevel = calculateFriendLevel(character.friends);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-3">
        <img 
          src="/lovable-uploads/3573e43c-7e90-4b43-8ccf-f535f3def654.png" 
          alt="Simeon Yetarian" 
          className="w-12 h-12 rounded-full border-2 border-blue-600 shadow-lg object-cover mr-3"
        />
        <div>
          <h3 className="font-bold text-lg dark:text-white">{character.name}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="stat-item">
          <span className="text-sm text-gray-500 dark:text-gray-400">Dinheiro</span>
          <span className="font-bold text-green-600 dark:text-green-400">${character.money.toLocaleString()}</span>
        </div>
        
        <div className="stat-item">
          <span className="text-sm text-gray-500 dark:text-gray-400">Amigos (Nível {friendLevel})</span>
          <span className="font-bold text-pink-600 dark:text-pink-400">{character.friends}</span>
        </div>
        
        <div className="stat-item">
          <span className="text-sm text-gray-500 dark:text-gray-400">Felicidade</span>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div className="bg-yellow-400 dark:bg-yellow-500 h-2 rounded-full" style={{ width: `${character.happiness}%` }}></div>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="text-sm text-gray-500 dark:text-gray-400">Energia</span>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" style={{ width: `${character.energy}%` }}></div>
          </div>
        </div>
        
        <div className="stat-item col-span-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Habilidade Negócios</span>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full" style={{ width: `${character.skills.business}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Character;
