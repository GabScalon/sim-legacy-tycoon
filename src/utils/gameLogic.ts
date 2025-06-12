
import { Character, Property, GameState, GameEvent } from "../types/game";
import { v4 as uuidv4 } from "uuid";

// Calculate friend level based on geometric progression: a1 = 10, ratio = 2
export const calculateFriendLevel = (friends: number): number => {
  if (friends < 10) return 1;
  
  let level = 1;
  let threshold = 10;
  
  while (friends >= threshold) {
    level++;
    threshold *= 2;
  }
  
  return level;
};

// Initialize a new character
export const createCharacter = (name: string): Character => {
  return {
    id: uuidv4(),
    name,
    money: 100000,
    happiness: 80,
    energy: 100,
    skills: {
      business: 20,
      social: 20,
      creativity: 20,
    },
    friends: 0,
  };
};

// Helper function to check for gaining a friend (65% chance)
const tryGainFriend = (gameState: GameState): { updatedCharacter: Character; friendEvent?: GameEvent } => {
  const gainedFriend = Math.random() < 0.65;
  
  if (gainedFriend) {
    const newFriendCount = gameState.character.friends + 1;
    const oldLevel = calculateFriendLevel(gameState.character.friends);
    const newLevel = calculateFriendLevel(newFriendCount);
    
    let happinessBonus = 15; // Base happiness for gaining a friend
    if (newLevel > oldLevel) {
      happinessBonus += 20; // Extra happiness for leveling up
    }
    
    const updatedCharacter = {
      ...gameState.character,
      friends: newFriendCount,
      happiness: Math.min(100, gameState.character.happiness + happinessBonus),
    };
    
    const friendEvent: GameEvent = {
      id: uuidv4(),
      title: newLevel > oldLevel ? `Level Up! Friend Level ${newLevel}` : "New Friend!",
      description: newLevel > oldLevel 
        ? `You made a new friend and reached friend level ${newLevel}! Your social circle is growing strong.`
        : "You made a new friend! Your social circle is growing.",
      effect: newLevel > oldLevel 
        ? `+1 Friend, Friend Level ${newLevel}, +${happinessBonus} Happiness`
        : `+1 Friend, +${happinessBonus} Happiness`,
      day: gameState.day,
    };
    
    return { updatedCharacter, friendEvent };
  }
  
  return { updatedCharacter: gameState.character };
};

// Generate new properties with higher values
const generateNewProperties = (currentPropertyCount: number): Property[] => {
  const baseMultiplier = Math.floor(currentPropertyCount / 9) + 1;
  const propertyTypes: ("residential" | "commercial")[] = [
    "residential", "residential", "commercial", "residential", "commercial",
    "residential", "commercial", "residential", "residential"
  ];

  const propertyNames = {
    residential: [
      "Luxury Villa", "Penthouse Suite", "Mansion Estate", "Palace Residence",
      "Royal Apartment", "Executive Home", "Premium Condo", "Elite Residence",
      "Exclusive Manor"
    ],
    commercial: [
      "Corporate Tower", "Business Complex", "Shopping Center", "Office Plaza",
      "Commercial District", "Trade Center", "Financial Hub", "Business Park",
      "Corporate Campus"
    ]
  };

  return Array.from({ length: 9 }, (_, i) => {
    const type = propertyTypes[i];
    const nameIndex = (currentPropertyCount + i) % propertyNames[type].length;
    
    return {
      id: uuidv4(),
      name: `${propertyNames[type][nameIndex]} Tier ${baseMultiplier}`,
      price: type === "residential"
        ? Math.floor((75000 + Math.random() * 150000) * baseMultiplier * 2)
        : Math.floor((120000 + Math.random() * 250000) * baseMultiplier * 2),
      rent: type === "residential"
        ? Math.floor((1000 + Math.random() * 3000) * baseMultiplier * 2)
        : Math.floor((3000 + Math.random() * 8000) * baseMultiplier * 2),
      level: 1,
      type,
      ownerId: null,
      position: {
        x: (i % 3) * 33.33,
        y: Math.floor(i / 3) * 33.33,
      },
    };
  });
};

// Check if all properties are owned and fully upgraded
const checkForPropertyExpansion = (gameState: GameState): GameState => {
  const allOwned = gameState.properties.every(p => p.ownerId === gameState.character.id);
  const allMaxLevel = gameState.properties.every(p => p.level >= 3);
  
  if (allOwned && allMaxLevel) {
    const newProperties = generateNewProperties(gameState.properties.length);
    
    const expansionEvent: GameEvent = {
      id: uuidv4(),
      title: "Property Market Expansion!",
      description: "You've dominated the current market! New premium properties are now available for purchase.",
      effect: "New Properties Available",
      day: gameState.day,
    };
    
    return {
      ...gameState,
      properties: [...gameState.properties, ...newProperties],
      events: [expansionEvent, ...gameState.events].slice(0, 10),
    };
  }
  
  return gameState;
};

// Initialize game properties
export const initializeProperties = (): Property[] => {
  const propertyTypes: ("residential" | "commercial")[] = [
    "residential", "residential", "commercial", "residential", "commercial",
    "residential", "commercial", "residential", "residential"
  ];

  return Array.from({ length: 9 }, (_, i) => ({
    id: uuidv4(),
    name: propertyTypes[i] === "residential"
      ? `${["Sunny", "Green", "Blue", "Modern", "Cozy"][i % 5]} House`
      : `${["Central", "Uptown", "Downtown", "Retail", "Office"][i % 5]} Business`,
    price: propertyTypes[i] === "residential"
      ? Math.floor(75000 + Math.random() * 150000)
      : Math.floor(120000 + Math.random() * 250000),
    rent: propertyTypes[i] === "residential"
      ? Math.floor(1000 + Math.random() * 3000)
      : Math.floor(3000 + Math.random() * 8000),
    level: 1,
    type: propertyTypes[i],
    ownerId: null,
    position: {
      x: (i % 3) * 33.33,
      y: Math.floor(i / 3) * 33.33,
    },
  }));
};

// Initialize game state
export const initializeGame = (characterName: string): GameState => {
  return {
    character: createCharacter(characterName),
    properties: initializeProperties(),
    day: 1,
    events: [],
  };
};

// Buy a property
export const buyProperty = (
  gameState: GameState,
  propertyId: string
): GameState => {
  const property = gameState.properties.find((p) => p.id === propertyId);

  if (
    !property ||
    property.ownerId ||
    gameState.character.money < property.price
  ) {
    return gameState;
  }

  const updatedProperties = gameState.properties.map((p) =>
    p.id === propertyId ? { ...p, ownerId: gameState.character.id } : p
  );

  let baseHappiness = 15; // Base happiness for buying property
  if (gameState.character.energy < 30) {
    baseHappiness = 5; // Reduced happiness if tired
  }

  let updatedCharacter = {
    ...gameState.character,
    money: gameState.character.money - property.price,
    happiness: Math.min(100, gameState.character.happiness + baseHappiness),
  };

  const { updatedCharacter: characterWithFriend, friendEvent } = tryGainFriend({
    ...gameState,
    character: updatedCharacter,
  });

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Property Purchased!",
    description: `You purchased ${property.name} for $${property.price.toLocaleString()}.`,
    effect: "-$" + property.price.toLocaleString(),
    day: gameState.day,
  };

  const events = friendEvent 
    ? [friendEvent, newEvent, ...gameState.events].slice(0, 10)
    : [newEvent, ...gameState.events].slice(0, 10);

  const gameStateWithPurchase = {
    ...gameState,
    character: characterWithFriend,
    properties: updatedProperties,
    events,
  };

  // Check for property expansion after purchase
  return checkForPropertyExpansion(gameStateWithPurchase);
};

// Upgrade a property
export const upgradeProperty = (
  gameState: GameState,
  propertyId: string
): GameState => {
  const property = gameState.properties.find((p) => p.id === propertyId);

  if (
    !property ||
    property.ownerId !== gameState.character.id ||
    property.level >= 3
  ) {
    return gameState;
  }

  const upgradeCost = property.price * 0.3;

  if (gameState.character.money < upgradeCost) {
    return gameState;
  }

  const updatedProperties = gameState.properties.map((p) =>
    p.id === propertyId
      ? {
          ...p,
          level: p.level + 1,
          rent: Math.floor(p.rent * 1.5),
        }
      : p
  );

  let updatedCharacter = {
    ...gameState.character,
    money: gameState.character.money - upgradeCost,
    skills: {
      ...gameState.character.skills,
      business: Math.min(100, gameState.character.skills.business + 5),
    },
  };

  const { updatedCharacter: characterWithFriend, friendEvent } = tryGainFriend({
    ...gameState,
    character: updatedCharacter,
  });

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Property Upgraded",
    description: `You upgraded ${property.name} to level ${property.level + 1}.`,
    effect: "-$" + upgradeCost.toLocaleString(),
    day: gameState.day,
  };

  const events = friendEvent 
    ? [friendEvent, newEvent, ...gameState.events].slice(0, 10)
    : [newEvent, ...gameState.events].slice(0, 10);

  const gameStateWithUpgrade = {
    ...gameState,
    character: characterWithFriend,
    properties: updatedProperties,
    events,
  };

  // Check for property expansion after upgrade
  return checkForPropertyExpansion(gameStateWithUpgrade);
};

// Collect rent
export const collectRent = (gameState: GameState): GameState => {
  const ownedProperties = gameState.properties.filter(
    (p) => p.ownerId === gameState.character.id
  );
  const totalRent = ownedProperties.reduce((sum, p) => sum + p.rent, 0);
  const advancedGameState = advanceDay(gameState);

  if (totalRent === 0) {
    return advancedGameState;
  }

  let updatedCharacter = {
    ...advancedGameState.character,
    money: advancedGameState.character.money + totalRent,
  };

  const { updatedCharacter: characterWithFriend, friendEvent } = tryGainFriend({
    ...advancedGameState,
    character: updatedCharacter,
  });

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Rent Collected",
    description: `You collected $${totalRent.toLocaleString()} in rent from your properties.`,
    effect: "+$" + totalRent.toLocaleString(),
    day: advancedGameState.day,
  };

  const events = friendEvent 
    ? [friendEvent, newEvent, ...advancedGameState.events].slice(0, 10)
    : [newEvent, ...advancedGameState.events].slice(0, 10);

  return {
    ...advancedGameState,
    character: characterWithFriend,
    events,
  };
};

// Rest to regain energy
export const rest = (gameState: GameState): GameState => {
  const updatedCharacter = {
    ...gameState.character,
    energy: Math.min(100, gameState.character.energy + 40),
    happiness: Math.min(100, gameState.character.happiness + 5),
  };

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Rested",
    description: "You took some time to rest and recover energy.",
    effect: "+40 Energy",
    day: gameState.day,
  };

  return {
    ...gameState,
    character: updatedCharacter,
    events: [newEvent, ...gameState.events].slice(0, 10),
  };
};

// Work to earn money
export const work = (gameState: GameState): GameState => {
  if (gameState.character.energy < 20) {
    return gameState;
  }

  const baseEarnings = 500;
  const skillBonus = gameState.character.skills.business * 10;
  const totalEarnings = baseEarnings + skillBonus;

  let happinessChange = 10; // Base happiness for working
  if (gameState.character.energy < 40) {
    happinessChange = -5; // Negative happiness if very tired
  }

  let updatedCharacter = {
    ...gameState.character,
    money: gameState.character.money + totalEarnings,
    energy: Math.max(0, gameState.character.energy - 20),
    happiness: Math.max(0, Math.min(100, gameState.character.happiness + happinessChange)),
    skills: {
      ...gameState.character.skills,
      business: Math.min(100, gameState.character.skills.business + 2),
    },
  };

  const { updatedCharacter: characterWithFriend, friendEvent } = tryGainFriend({
    ...gameState,
    character: updatedCharacter,
  });

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Work Completed",
    description: `You worked hard and earned $${totalEarnings.toLocaleString()}. Your business skills improved!`,
    effect: "+$" + totalEarnings.toLocaleString(),
    day: gameState.day,
  };

  const events = friendEvent 
    ? [friendEvent, newEvent, ...gameState.events].slice(0, 10)
    : [newEvent, ...gameState.events].slice(0, 10);

  // Advance the day after working
  const gameStateWithWork = {
    ...gameState,
    character: characterWithFriend,
    events,
  };

  return advanceDay(gameStateWithWork);
};

// Advance a day in the game
export const advanceDay = (gameState: GameState): GameState => {
  const ownedPropertiesCount = gameState.properties.filter((p) => p.ownerId === gameState.character.id).length;
  const dailyExpenses = 100 + ownedPropertiesCount * 50;

  // Check if expenses are high and affect happiness
  let happinessChange = -5; // Base daily happiness loss
  if (dailyExpenses > 500) {
    happinessChange = -15; // Extra happiness loss for high expenses
  }

  // Check if character hasn't made friends recently (low social interaction)
  const recentFriendEvents = gameState.events.filter(
    event => event.title.includes("Friend") && (gameState.day - event.day) <= 5
  );
  if (recentFriendEvents.length === 0 && gameState.day > 5) {
    happinessChange -= 10; // Additional happiness loss for social isolation
  }

  let updatedCharacter = {
    ...gameState.character,
    money: gameState.character.money - dailyExpenses,
    energy: Math.max(10, gameState.character.energy - 15),
    happiness: Math.max(10, gameState.character.happiness + happinessChange),
  };

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Daily Expenses",
    description: `You paid $${dailyExpenses.toLocaleString()} in daily expenses.`,
    effect: "-$" + dailyExpenses.toLocaleString(),
    day: gameState.day + 1,
  };

  let updatedEvents = [newEvent, ...gameState.events].slice(0, 10);

  // Random life event (10% chance)
  if (Math.random() < 0.1) {
    const events = [
      {
        title: "Market Boom",
        description: "The real estate market is booming! Property values increase.",
        effect: "+10% Property Value",
      },
      {
        title: "Market Dip",
        description: "The real estate market is experiencing a dip.",
        effect: "-5% Property Value",
      },
      {
        title: "Unexpected Windfall",
        description: "You received an unexpected inheritance!",
        effect: "+$10,000",
      },
      {
        title: "Health Issue",
        description: "You're feeling under the weather. Medical bills pile up.",
        effect: "-$5,000",
      },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];

    updatedEvents = [
      {
        id: uuidv4(),
        ...randomEvent,
        day: gameState.day + 1,
      },
      ...updatedEvents,
    ].slice(0, 10);

    // Apply event effects
    if (randomEvent.title === "Market Boom") {
      const updatedProperties = gameState.properties.map((p) => ({
        ...p,
        price: Math.floor(p.price * 1.1),
      }));

      return {
        ...gameState,
        day: gameState.day + 1,
        character: updatedCharacter,
        properties: updatedProperties,
        events: updatedEvents,
      };
    } else if (randomEvent.title === "Market Dip") {
      const updatedProperties = gameState.properties.map((p) => ({
        ...p,
        price: Math.floor(p.price * 0.95),
      }));

      return {
        ...gameState,
        day: gameState.day + 1,
        character: updatedCharacter,
        properties: updatedProperties,
        events: updatedEvents,
      };
    } else if (randomEvent.title === "Unexpected Windfall") {
      updatedCharacter = {
        ...updatedCharacter,
        money: updatedCharacter.money + 10000,
        happiness: Math.min(100, updatedCharacter.happiness + 20),
      };
    } else if (randomEvent.title === "Health Issue") {
      updatedCharacter = {
        ...updatedCharacter,
        money: updatedCharacter.money - 5000,
        energy: Math.max(10, updatedCharacter.energy - 20),
        happiness: Math.max(10, updatedCharacter.happiness - 15),
      };
    }
  }

  return {
    ...gameState,
    day: gameState.day + 1,
    character: updatedCharacter,
    events: updatedEvents,
  };
};
