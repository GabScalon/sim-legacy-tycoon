export interface Character {
  id: string;
  name: string;
  money: number;
  happiness: number;
  energy: number;
  skills: {
    business: number;
    social: number;
    creativity: number;
  };
  friends: number;
}

export interface Property {
  id: string;
  name: string;
  price: number;
  rent: number;
  level: number;
  type: "residential" | "commercial";
  ownerId: string | null;
  position: { x: number; y: number };
}

export interface GameState {
  character: Character;
  properties: Property[];
  day: number;
  events: GameEvent[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  effect: string;
  day: number;
}
