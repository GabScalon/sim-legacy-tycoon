import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
  work,
  advanceDay 
} from "@/utils/gameLogic";
import { GameState } from "@/types/game";

const Index = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { toast } = useToast();

  // Initialize game with Simeon Yetarian automatically
  useEffect(() => {
    const newGameState = initializeGame("Simeon Yetarian");
    setGameState(newGameState);
    toast({
      title: "Game Started",
      description: "Welcome to Simopoly, Simeon Yetarian! Build your property empire and create your legacy.",
    });
  }, [toast]);

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
    
    // Check if a friend was gained
    const friendEvent = updatedGameState.events.find(e => e.title.includes("Friend"));
    if (friendEvent && friendEvent.day === updatedGameState.day) {
      toast({
        title: friendEvent.title,
        description: friendEvent.description,
      });
    }
    
    toast({
      title: "You bought a property!",
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

  const handleWork = () => {
    if (!gameState) return;
    
    if (gameState.character.energy < 20) {
      toast({
        title: "Too Tired to Work",
        description: "You need at least 20 energy to work. Try resting first.",
        variant: "destructive",
      });
      return;
    }
    
    const baseEarnings = 500;
    const skillBonus = gameState.character.skills.business * 10;
    const totalEarnings = baseEarnings + skillBonus;
    
    const updatedGameState = work(gameState);
    setGameState(updatedGameState);
    
    // Check if a friend was gained
    const friendEvent = updatedGameState.events.find(e => e.title.includes("Friend"));
    if (friendEvent && friendEvent.day === updatedGameState.day) {
      toast({
        title: friendEvent.title,
        description: friendEvent.description,
      });
    }
    
    toast({
      title: "Work Completed",
      description: `You earned $${totalEarnings.toLocaleString()} and improved your business skills!`,
    });
  };

  const handleAdvanceDay = () => {
    if (!gameState) return;
    
    const updatedGameState = advanceDay(gameState);
    setGameState(updatedGameState);
    
    toast({
      title: "Day Completed",
      description: `You have advanced to day ${updatedGameState.day}.`,
    });
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Loading Simopoly...</h1>
          <p className="text-lg text-gray-600">Preparing your property empire</p>
        </div>
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
          <p className="text-gray-600">Build your property empire</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column - Character & Actions */}
          <div className="lg:col-span-1 space-y-4">
            <Character 
              character={gameState.character} 
              onCharacterCreated={() => {}} 
            />
            <ActionPanel 
              onCollectRent={handleCollectRent}
              onRest={handleRest}
              onAdvanceDay={handleAdvanceDay}
              onWork={handleWork}
              energy={gameState.character.energy}
              ownedPropertiesCount={ownedPropertiesCount}
              businessSkill={gameState.character.skills.business}
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
