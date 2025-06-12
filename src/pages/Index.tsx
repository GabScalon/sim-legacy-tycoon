
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Character from "@/components/Character";
import GameBoard from "@/components/GameBoard";
import StatsPanel from "@/components/StatsPanel";
import ActionPanel from "@/components/ActionPanel";
import ThemeToggle from "@/components/ThemeToggle";
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
      title: "Jogo Iniciado",
      description: "Bem-vindo ao Simeon City, Simeon Yetarian! Construa seu império imobiliário e crie seu legado.",
    });
  }, [toast]);

  const handleBuyProperty = (propertyId: string) => {
    if (!gameState) return;
    
    const property = gameState.properties.find(p => p.id === propertyId);
    if (!property) return;
    
    if (gameState.character.money < property.price) {
      toast({
        title: "Não é Possível Comprar Propriedade",
        description: "Você não tem dinheiro suficiente para comprar esta propriedade.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGameState = buyProperty(gameState, propertyId);
    setGameState(updatedGameState);
    
    // Check if a friend was gained
    const friendEvent = updatedGameState.events.find(e => e.title.includes("Amigo"));
    if (friendEvent && friendEvent.day === updatedGameState.day) {
      toast({
        title: friendEvent.title,
        description: friendEvent.description,
      });
    }
    
    toast({
      title: "Você comprou uma propriedade!",
      description: `Você comprou com sucesso ${property.name}.`,
    });
  };

  const handleUpgradeProperty = (propertyId: string) => {
    if (!gameState) return;
    
    const property = gameState.properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const upgradeCost = property.price * 0.3;
    
    if (gameState.character.money < upgradeCost) {
      toast({
        title: "Não é Possível Melhorar Propriedade",
        description: "Você não tem dinheiro suficiente para melhorar esta propriedade.",
        variant: "destructive",
      });
      return;
    }
    
    if (property.level >= 3) {
      toast({
        title: "Nível Máximo Atingido",
        description: "Esta propriedade já está em seu nível máximo.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGameState = upgradeProperty(gameState, propertyId);
    setGameState(updatedGameState);
    
    toast({
      title: "Propriedade Melhorada",
      description: `Você melhorou com sucesso ${property.name} para o nível ${property.level + 1}.`,
    });
  };

  const handleCollectRent = () => {
    if (!gameState) return;
    
    if (gameState.character.energy < 15) {
      toast({
        title: "Muito Cansado para Coletar Aluguel",
        description: "Você precisa de pelo menos 15 de energia para coletar aluguel. Tente descansar primeiro.",
        variant: "destructive",
      });
      return;
    }
    
    const ownedProperties = gameState.properties.filter(p => p.ownerId === gameState.character.id);
    if (ownedProperties.length === 0) {
      toast({
        title: "Nenhuma Propriedade",
        description: "Você não possui propriedades para coletar aluguel.",
        variant: "destructive",
      });
      return;
    }
    
    const totalRent = ownedProperties.reduce((sum, p) => sum + p.rent, 0);
    const updatedGameState = collectRent(gameState);
    setGameState(updatedGameState);
    
    toast({
      title: "Aluguel Coletado",
      description: `Você coletou $${totalRent.toLocaleString()} em aluguéis de suas propriedades.`,
    });
  };

  const handleRest = () => {
    if (!gameState) return;
    
    if (gameState.character.energy >= 100) {
      toast({
        title: "Já Descansado",
        description: "Sua energia já está no máximo.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedGameState = rest(gameState);
    setGameState(updatedGameState);
    
    toast({
      title: "Descansou",
      description: "Você descansou e recuperou energia.",
    });
  };

  const handleWork = () => {
    if (!gameState) return;
    
    if (gameState.character.energy < 20) {
      toast({
        title: "Muito Cansado para Trabalhar",
        description: "Você precisa de pelo menos 20 de energia para trabalhar. Tente descansar primeiro.",
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
    const friendEvent = updatedGameState.events.find(e => e.title.includes("Amigo"));
    if (friendEvent && friendEvent.day === updatedGameState.day) {
      toast({
        title: friendEvent.title,
        description: friendEvent.description,
      });
    }
    
    toast({
      title: "Trabalho Concluído",
      description: `Você ganhou $${totalEarnings.toLocaleString()} e melhorou suas habilidades de negócios!`,
    });
  };

  const handleAdvanceDay = () => {
    if (!gameState) return;
    
    const updatedGameState = advanceDay(gameState);
    setGameState(updatedGameState);
    
    toast({
      title: "Dia Concluído",
      description: `Você avançou para o dia ${updatedGameState.day}.`,
    });
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-2">Carregando Simeon City...</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Preparando seu império imobiliário</p>
        </div>
      </div>
    );
  }

  const ownedPropertiesCount = gameState.properties.filter(
    (p) => p.ownerId === gameState.character.id
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-1">Simeon City</h1>
          <p className="text-gray-600 dark:text-gray-300">A cidade onde você pode ser si próprio.</p>
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
