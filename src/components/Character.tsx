
import { useState, useEffect } from "react";
import { Character as CharacterType } from "../types/game";

interface CharacterProps {
  character: CharacterType;
  onCharacterCreated: (name: string) => void;
}

const Character = ({ character, onCharacterCreated }: CharacterProps) => {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(true);

  useEffect(() => {
    if (character?.name) {
      setIsCreating(false);
    }
  }, [character]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCharacterCreated(name);
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Create Your Character</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Character Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a name..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Start Your Legacy
          </button>
        </form>
      </div>
    );
  }

  // Display character stats
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3">
          {character.name.charAt(0)}
        </div>
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
