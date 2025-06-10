
import { Character as CharacterType } from "../types/game";

interface CharacterProps {
  character: CharacterType;
  onCharacterCreated: (name: string) => void;
}

const Character = ({ character }: CharacterProps) => {
  // Display character stats directly
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-3">
        <img 
          src="/lovable-uploads/3573e43c-7e90-4b43-8ccf-f535f3def654.png" 
          alt="Simeon" 
          className="w-12 h-12 rounded-full border-2 border-blue-600 shadow-lg object-cover mr-3"
        />
        <div>
          <h3 className="font-bold text-lg">{character.name}</h3>
          <p className="text-sm text-gray-600">Generation {character.generation} • Age {character.age}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="stat-item">
          <span className="text-sm text-gray-500">Money</span>
          <span className="font-bold text-green-600">${character.money.toLocaleString()}</span>
        </div>
        
        <div className="stat-item">
          <span className="text-sm text-gray-500">Happiness</span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${character.happiness}%` }}></div>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="text-sm text-gray-500">Energy</span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${character.energy}%` }}></div>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="text-sm text-gray-500">Business Skill</span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${character.skills.business}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Character;
