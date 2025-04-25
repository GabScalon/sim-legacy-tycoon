
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Character from "@/components/Character";
import GameBoard from "@/components/GameBoard";
import StatsPanel from "@/components/StatsPanel";
import ActionPanel from "@/components/ActionPanel";
import { 
  initializeGame, 
  buyProperty, 
  upgradeProperty, 
  collectRent, 
  rest, 
  advanceDay 
} from "@/utils/gameLogic";
import { GameState } from "@/types/game";

const Index = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { toast } = useToast();

  const handleCharacterCreated = (name: string) => {
    const newGameState = initializeGame(name);
    setGameState(newGameState);
    toast({
      title: "Game Started",
      description: `Welcome to Simopoly, ${name}! Build your property empire and create your legacy.`,
    });
  };

  const handleBuyProperty = (propertyId: string) => {
    if (!gameState) return;
    
    const property = gameState.properties.find(p => p.id === propertyId);
    if (!property) return;
    
    if (gameState.character.money < property.price) {
      toast({
        title: "Cannot Buy Property",
        description: "You don't have enough money to buy this property.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGameState = buyProperty(gameState, propertyId);
    setGameState(updatedGameState);
    
    toast({
      title: "Property Purchased",
      description: `You have successfully purchased ${property.name}.`,
    });
  };

  const handleUpgradeProperty = (propertyId: string) => {
    if (!gameState) return;
    
    const property = gameState.properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const upgradeCost = property.price * 0.3;
    
    if (gameState.character.money < upgradeCost) {
      toast({
        title: "Cannot Upgrade Property",
        description: "You don't have enough money to upgrade this property.",
        variant: "destructive",
      });
      return;
    }
    
    if (property.level >= 3) {
      toast({
        title: "Maximum Level Reached",
        description: "This property is already at its maximum level.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGameState = upgradeProperty(gameState, propertyId);
    setGameState(updatedGameState);
    
    toast({
      title: "Property Upgraded",
      description: `You have successfully upgraded ${property.name} to level ${property.level + 1}.`,
    });
  };

  const handleCollectRent = () => {
    if (!gameState) return;
    
    const ownedProperties = gameState.properties.filter(p => p.ownerId === gameState.character.id);
    if (ownedProperties.length === 0) {
      toast({
        title: "No Properties",
        description: "You don't own any properties to collect rent from.",
        variant: "destructive",
      });
      return;
    }
    
    const totalRent = ownedProperties.reduce((sum, p) => sum + p.rent, 0);
    const updatedGameState = collectRent(gameState);
    setGameState(updatedGameState);
    
    toast({
      title: "Rent Collected",
      description: `You collected $${totalRent.toLocaleString()} in rent from your properties.`,
    });
  };

  const handleRest = () => {
    if (!gameState) return;
    
    if (gameState.character.energy >= 100) {
      toast({
        title: "Already Rested",
        description: "Your energy is already at maximum.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGameState = rest(gameState);
    setGameState(updatedGameState);
    
    toast({
      title: "Rested",
      description: "You've taken some time to rest and recovered energy.",
    });
  };

  const handleAdvanceDay = () => {
    if (!gameState) return;
    
    const updatedGameState = advanceDay(gameState);
    
    // Check if generation changed
    if (updatedGameState.character.id !== gameState.character.id) {
      toast({
        title: "New Generation",
        description: `${gameState.character.name} has passed away. Their heir continues the legacy.`,
      });
    }
    
    setGameState(updatedGameState);
    
    toast({
      title: "Day Completed",
      description: `You have advanced to day ${updatedGameState.day}.`,
    });
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Simopoly</h1>
          <p className="text-lg text-gray-600">Build your property empire and create a lasting legacy</p>
        </div>
        <Character 
          character={null as any} 
          onCharacterCreated={handleCharacterCreated} 
        />
      </div>
    );
  }

  const ownedPropertiesCount = gameState.properties.filter(
    (p) => p.ownerId === gameState.character.id
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-1">Simopoly</h1>
          <p className="text-gray-600">Build your property empire • Generation {gameState.character.generation}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column - Character & Actions */}
          <div className="lg:col-span-1 space-y-4">
            <Character 
              character={gameState.character} 
              onCharacterCreated={handleCharacterCreated} 
            />
            <ActionPanel 
              onCollectRent={handleCollectRent}
              onRest={handleRest}
              onAdvanceDay={handleAdvanceDay}
              energy={gameState.character.energy}
              ownedPropertiesCount={ownedPropertiesCount}
            />
          </div>
          
          {/* Middle Column - Game Board */}
          <div className="lg:col-span-2">
            <GameBoard 
              properties={gameState.properties}
              characterMoney={gameState.character.money}
              characterId={gameState.character.id}
              onBuyProperty={handleBuyProperty}
              onUpgradeProperty={handleUpgradeProperty}
            />
          </div>
          
          {/* Right Column - Stats */}
          <div className="lg:col-span-1">
            <StatsPanel 
              money={gameState.character.money}
              day={gameState.day}
              events={gameState.events}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
