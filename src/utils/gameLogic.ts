import { GameState, Character, Property, GameEvent } from "../types/game";
import { v4 as uuidv4 } from "uuid";

export const initializeGame = (characterName: string): GameState => {
  const character: Character = {
    id: uuidv4(),
    name: characterName,
    money: 100000,
    happiness: 100,
    energy: 100,
    skills: {
      business: 1,
      social: 1,
      creativity: 1,
    },
    friends: 0,
  };

  const properties: Property[] = [
    {
      id: "1",
      name: "Apartamento Centro",
      price: 50000,
      rent: 5000,
      level: 1,
      type: "residential",
      ownerId: null,
      position: { x: 0, y: 0 },
    },
    {
      id: "2",
      name: "Loja de Esquina",
      price: 75000,
      rent: 7500,
      level: 1,
      type: "commercial",
      ownerId: null,
      position: { x: 1, y: 0 },
    },
    {
      id: "3",
      name: "Casa Suburbana",
      price: 100000,
      rent: 10000,
      level: 1,
      type: "residential",
      ownerId: null,
      position: { x: 2, y: 0 },
    },
    {
      id: "4",
      name: "Escritório Comercial",
      price: 125000,
      rent: 12500,
      level: 1,
      type: "commercial",
      ownerId: null,
      position: { x: 0, y: 1 },
    },
    {
      id: "5",
      name: "Condomínio Residencial",
      price: 150000,
      rent: 15000,
      level: 1,
      type: "residential",
      ownerId: null,
      position: { x: 1, y: 1 },
    },
    {
      id: "6",
      name: "Centro Comercial",
      price: 175000,
      rent: 17500,
      level: 1,
      type: "commercial",
      ownerId: null,
      position: { x: 2, y: 1 },
    },
    {
      id: "7",
      name: "Prédio Residencial",
      price: 200000,
      rent: 20000,
      level: 1,
      type: "residential",
      ownerId: null,
      position: { x: 0, y: 2 },
    },
    {
      id: "8",
      name: "Complexo Empresarial",
      price: 225000,
      rent: 22500,
      level: 1,
      type: "commercial",
      ownerId: null,
      position: { x: 1, y: 2 },
    },
    {
      id: "9",
      name: "Mansão Luxuosa",
      price: 250000,
      rent: 25000,
      level: 1,
      type: "residential",
      ownerId: null,
      position: { x: 2, y: 2 },
    },
  ];

  return {
    character,
    properties,
    day: 1,
    events: [],
  };
};

export const buyProperty = (gameState: GameState, propertyId: string): GameState => {
  const property = gameState.properties.find(p => p.id === propertyId);
  if (!property || property.ownerId || gameState.character.money < property.price) {
    return gameState;
  }

  const newCharacter = {
    ...gameState.character,
    money: gameState.character.money - property.price,
  };

  const newProperties = gameState.properties.map(p =>
    p.id === propertyId ? { ...p, ownerId: gameState.character.id } : p
  );

  let newEvents = [...gameState.events];
  
  // 30% chance to gain a friend when buying property
  if (Math.random() < 0.3) {
    newCharacter.friends += 1;
    const friendEvent: GameEvent = {
      id: uuidv4(),
      title: "Novo Amigo",
      description: "Você conheceu alguém interessante durante a compra da propriedade!",
      effect: "+1 Amigo",
      day: gameState.day,
    };
    newEvents = [friendEvent, ...newEvents].slice(0, 10);
  }

  // Check if all current properties are owned and maxed out
  const allPropertiesOwnedAndMaxed = newProperties.every(p => 
    p.ownerId === gameState.character.id && p.level === 3
  );

  if (allPropertiesOwnedAndMaxed) {
    const currentTier = Math.floor(newProperties.length / 3) + 1;
    for (let i = 0; i < 3; i++) {
      const newProperty = generateNewProperty(newProperties.length + 1 + i, currentTier);
      newProperties.push(newProperty);
    }
    
    const expansionEvent: GameEvent = {
      id: uuidv4(),
      title: "Novas Propriedades Disponíveis",
      description: "Três novas propriedades apareceram no mercado!",
      effect: "Novas Oportunidades",
      day: gameState.day,
    };
    newEvents = [expansionEvent, ...newEvents].slice(0, 10);
  }

  return {
    ...gameState,
    character: newCharacter,
    properties: newProperties,
    events: newEvents,
  };
};

export const upgradeProperty = (gameState: GameState, propertyId: string): GameState => {
  const property = gameState.properties.find(p => p.id === propertyId);
  if (!property || property.ownerId !== gameState.character.id || property.level >= 3) {
    return gameState;
  }

  const upgradeCost = property.price * 0.3;
  if (gameState.character.money < upgradeCost) {
    return gameState;
  }

  const newCharacter = {
    ...gameState.character,
    money: gameState.character.money - upgradeCost,
  };

  const newProperties = gameState.properties.map(p =>
    p.id === propertyId 
      ? { ...p, level: p.level + 1, rent: Math.floor(p.rent * 1.5) }
      : p
  );

  let newEvents = [...gameState.events];
  
  // Check if all current properties are owned and maxed out after upgrade
  const allPropertiesOwnedAndMaxed = newProperties.every(p => 
    p.ownerId === gameState.character.id && p.level === 3
  );

  if (allPropertiesOwnedAndMaxed) {
    const currentTier = Math.floor(newProperties.length / 3) + 1;
    for (let i = 0; i < 3; i++) {
      const newProperty = generateNewProperty(newProperties.length + 1 + i, currentTier);
      newProperties.push(newProperty);
    }
    
    const expansionEvent: GameEvent = {
      id: uuidv4(),
      title: "Novas Propriedades Disponíveis",
      description: "Três novas propriedades apareceram no mercado!",
      effect: "Novas Oportunidades",
      day: gameState.day,
    };
    newEvents = [expansionEvent, ...newEvents].slice(0, 10);
  }

  return {
    ...gameState,
    character: newCharacter,
    properties: newProperties,
    events: newEvents,
  };
};

const generateNewProperty = (id: number, tier: number): Property => {
  const residentialNames = [
    "Apartamento Centro", "Casa Suburbana", "Mansão Luxuosa", "Penthouse Elite", 
    "Villa Exclusiva", "Castelo Moderno", "Arranha-céu Residencial", "Complexo Premium",
    "Residência Imperial", "Palácio Urbano"
  ];
  
  const commercialNames = [
    "Loja de Esquina", "Shopping Center", "Torre Corporativa", "Centro Empresarial",
    "Complexo Comercial", "Distrito Financeiro", "Mega Mall", "Centro de Negócios Elite",
    "Hub Corporativo", "Metrópole Comercial"
  ];

  const isResidential = Math.random() < 0.5;
  const names = isResidential ? residentialNames : commercialNames;
  const nameIndex = Math.min(tier - 1, names.length - 1);
  
  const basePrice = 50000 * Math.pow(2, tier - 1);
  const baseRent = basePrice * 0.1;

  return {
    id: id.toString(),
    name: names[nameIndex],
    price: basePrice,
    rent: baseRent,
    level: 1,
    type: isResidential ? "residential" : "commercial",
    ownerId: null,
    position: { x: (id - 1) % 3, y: Math.floor((id - 1) / 3) },
  };
};

export const collectRent = (gameState: GameState): GameState => {
  if (gameState.character.energy < 15) {
    return gameState;
  }

  const ownedProperties = gameState.properties.filter(p => p.ownerId === gameState.character.id);
  const totalRent = ownedProperties.reduce((sum, p) => sum + p.rent, 0);

  const newCharacter = {
    ...gameState.character,
    money: gameState.character.money + totalRent,
    energy: Math.max(0, gameState.character.energy - 15),
  };

  const rentEvent: GameEvent = {
    id: uuidv4(),
    title: "Aluguel Coletado",
    description: `Você coletou $${totalRent.toLocaleString()} de suas ${ownedProperties.length} propriedade(s).`,
    effect: `+$${totalRent.toLocaleString()}`,
    day: gameState.day,
  };

  return {
    ...gameState,
    character: newCharacter,
    events: [rentEvent, ...gameState.events].slice(0, 10),
  };
};

export const rest = (gameState: GameState): GameState => {
  const newCharacter = {
    ...gameState.character,
    energy: Math.min(100, gameState.character.energy + 40),
    happiness: Math.min(100, gameState.character.happiness + 10),
  };

  const newDay = gameState.day + 1;

  const restEvent: GameEvent = {
    id: uuidv4(),
    title: "Descansou e Novo Dia",
    description: `Você descansou bem e um novo dia chegou! É o dia ${newDay} em Simeon City.`,
    effect: "+40 Energia, +10 Felicidade, Dia Avançado",
    day: newDay,
  };

  return {
    ...gameState,
    character: newCharacter,
    day: newDay,
    events: [restEvent, ...gameState.events].slice(0, 10),
  };
};

export const work = (gameState: GameState): GameState => {
  if (gameState.character.energy < 20) {
    return gameState;
  }

  const baseEarnings = 5000;
  const skillBonus = gameState.character.skills.business * 10;
  const totalEarnings = baseEarnings + skillBonus;

  let newCharacter = {
    ...gameState.character,
    money: gameState.character.money + totalEarnings,
    energy: Math.max(0, gameState.character.energy - 20),
    skills: {
      ...gameState.character.skills,
      business: Math.min(100, gameState.character.skills.business + 1),
    },
  };

  let newEvents = [...gameState.events];
  
  // 20% chance to gain a friend when working
  if (Math.random() < 0.2) {
    newCharacter.friends += 1;
    const friendEvent: GameEvent = {
      id: uuidv4(),
      title: "Novo Amigo",
      description: "Você conheceu um colega interessante no trabalho!",
      effect: "+1 Amigo",
      day: gameState.day,
    };
    newEvents = [friendEvent, ...newEvents].slice(0, 10);
  }

  const workEvent: GameEvent = {
    id: uuidv4(),
    title: "Trabalho Concluído",
    description: `Você trabalhou duro e ganhou $${totalEarnings.toLocaleString()}, melhorando suas habilidades de negócios.`,
    effect: `+$${totalEarnings.toLocaleString()}, +1 Habilidade Negócios`,
    day: gameState.day,
  };

  newEvents = [workEvent, ...newEvents].slice(0, 10);

  return {
    ...gameState,
    character: newCharacter,
    events: newEvents,
  };
};

export const advanceDay = (gameState: GameState): GameState => {
  const newDay = gameState.day + 1;
  
  const dayEvent: GameEvent = {
    id: uuidv4(),
    title: "Novo Dia",
    description: `Um novo dia chegou! É o dia ${newDay} em Simeon City.`,
    effect: "Dia Avançado",
    day: newDay,
  };

  return {
    ...gameState,
    day: newDay,
    events: [dayEvent, ...gameState.events].slice(0, 10),
  };
};

export const calculateFriendLevel = (friends: number): number => {
  if (friends >= 50) return 5;
  if (friends >= 25) return 4;
  if (friends >= 10) return 3;
  if (friends >= 5) return 2;
  return 1;
};
