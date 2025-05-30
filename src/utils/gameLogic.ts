import { Character, Property, GameState, GameEvent } from "../types/game";
import { v4 as uuidv4 } from "uuid";

// Initialize a new character
export const createCharacter = (name: string): Character => {
  return {
    id: uuidv4(),
    name,
    age: 25,
    money: 100000,
    happiness: 80,
    energy: 100,
    skills: {
      business: 20,
      social: 20,
      creativity: 20,
    },
    generation: 1,
  };
};

// Initialize game properties
export const initializeProperties = (): Property[] => {
  const propertyTypes: ("residential" | "commercial")[] = [
    "residential",
    "residential",
    "commercial",
    "residential",
    "commercial",
    "residential",
    "commercial",
    "residential",
    "residential",
  ];

  return Array.from({ length: 9 }, (_, i) => ({
    id: uuidv4(),
    name:
      propertyTypes[i] === "residential"
        ? `${["Sunny", "Green", "Blue", "Modern", "Cozy"][i % 5]} House`
        : `${
            ["Central", "Uptown", "Downtown", "Retail", "Office"][i % 5]
          } Business`,
    price:
      propertyTypes[i] === "residential"
        ? Math.floor(75000 + Math.random() * 150000)
        : Math.floor(120000 + Math.random() * 250000),
    rent:
      propertyTypes[i] === "residential"
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

  const updatedCharacter = {
    ...gameState.character,
    money: gameState.character.money - property.price,
    happiness: Math.min(100, gameState.character.happiness + 10),
  };

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Property Purchased",
    description: `You purchased ${
      property.name
    } for $${property.price.toLocaleString()}.`,
    effect: "-$" + property.price.toLocaleString(),
    day: gameState.day,
  };

  return {
    ...gameState,
    character: updatedCharacter,
    properties: updatedProperties,
    events: [newEvent, ...gameState.events].slice(0, 10),
  };
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

  const updatedCharacter = {
    ...gameState.character,
    money: gameState.character.money - upgradeCost,
    skills: {
      ...gameState.character.skills,
      business: Math.min(100, gameState.character.skills.business + 5),
    },
  };

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Property Upgraded",
    description: `You upgraded ${property.name} to level ${
      property.level + 1
    }.`,
    effect: "-$" + upgradeCost.toLocaleString(),
    day: gameState.day,
  };

  return {
    ...gameState,
    character: updatedCharacter,
    properties: updatedProperties,
    events: [newEvent, ...gameState.events].slice(0, 10),
  };
};

// Collect rent
export const collectRent = (gameState: GameState): GameState => {
  const ownedProperties = gameState.properties.filter(
    (p) => p.ownerId === gameState.character.id
  );
  const totalRent = ownedProperties.reduce((sum, p) => sum + p.rent, 0);
  advanceDay(gameState);

  if (totalRent === 0) {
    return gameState;
  }

  const updatedCharacter = {
    ...gameState.character,
    money: gameState.character.money + totalRent,
  };

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "Rent Collected",
    description: `You collected $${totalRent.toLocaleString()} in rent from your properties.`,
    effect: "+$" + totalRent.toLocaleString(),
    day: gameState.day,
  };

  return {
    ...gameState,
    character: updatedCharacter,
    events: [newEvent, ...gameState.events].slice(0, 10),
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

// Advance a day in the game
export const advanceDay = (gameState: GameState): GameState => {
  const dailyExpenses =
    100 +
    gameState.properties.filter((p) => p.ownerId === gameState.character.id)
      .length *
      50;

  let updatedCharacter = {
    ...gameState.character,
    money: gameState.character.money - dailyExpenses,
    energy: Math.max(10, gameState.character.energy - 15),
    happiness: Math.max(10, gameState.character.happiness - 5),
  };

  // Every 30 days, character ages one year
  if (gameState.day % 30 === 0) {
    updatedCharacter = {
      ...updatedCharacter,
      age: updatedCharacter.age + 1,
    };
  }

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
        description:
          "The real estate market is booming! Property values increase.",
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

  // Check for game over or inheritance
  if (updatedCharacter.money < 0 || updatedCharacter.age >= 80) {
    // Game over or next generation
    return handleEndOfLife(gameState);
  }

  return {
    ...gameState,
    day: gameState.day + 1,
    character: updatedCharacter,
    events: updatedEvents,
  };
};

// Handle end of life transition
const handleEndOfLife = (gameState: GameState): GameState => {
  const ownedProperties = gameState.properties.filter(
    (p) => p.ownerId === gameState.character.id
  );
  const totalWealth =
    gameState.character.money +
    ownedProperties.reduce((sum, p) => sum + p.price, 0);

  // Create a heir (next generation character)
  const heir: Character = {
    id: uuidv4(),
    name: `Heir of ${gameState.character.name}`,
    age: 25,
    money: gameState.character.money > 0 ? gameState.character.money : 10000, // Inheritance or fresh start
    happiness: 70,
    energy: 100,
    skills: {
      business: Math.min(100, gameState.character.skills.business + 10),
      social: gameState.character.skills.social,
      creativity: gameState.character.skills.creativity,
    },
    generation: gameState.character.generation + 1,
  };

  // Transfer property ownership to heir
  const updatedProperties = gameState.properties.map((p) =>
    p.ownerId === gameState.character.id ? { ...p, ownerId: heir.id } : p
  );

  const newEvent: GameEvent = {
    id: uuidv4(),
    title: "New Generation",
    description: `${
      gameState.character.name
    } has passed away. Their heir takes over with a net worth of $${totalWealth.toLocaleString()}.`,
    effect: "Next Generation",
    day: gameState.day + 1,
  };

  return {
    ...gameState,
    day: gameState.day + 1,
    character: heir,
    properties: updatedProperties,
    events: [newEvent, ...gameState.events].slice(0, 10),
  };
};
