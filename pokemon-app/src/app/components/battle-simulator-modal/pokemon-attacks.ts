export interface PokemonAttack {
  name: string;
  type: string;
  power: number;
  accuracy: number;
  category: 'physical' | 'special' | 'status';
}

export const POKEMON_ATTACKS: { [key: string]: PokemonAttack[] } = {
  normal: [
    { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
    { name: 'Scratch', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
    { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, category: 'physical' }
  ],

  fire: [
    { name: 'Ember', type: 'fire', power: 40, accuracy: 100, category: 'special' },
    { name: 'Fire Punch', type: 'fire', power: 75, accuracy: 100, category: 'physical' },
    { name: 'Flamethrower', type: 'fire', power: 90, accuracy: 100, category: 'special' }
  ],

  water: [
    { name: 'Water Gun', type: 'water', power: 40, accuracy: 100, category: 'special' },
    { name: 'Bubble', type: 'water', power: 40, accuracy: 100, category: 'special' },
    { name: 'Surf', type: 'water', power: 90, accuracy: 100, category: 'special' }
  ],

  grass: [
    { name: 'Vine Whip', type: 'grass', power: 45, accuracy: 100, category: 'physical' },
    { name: 'Razor Leaf', type: 'grass', power: 55, accuracy: 95, category: 'physical' },
    { name: 'Solar Beam', type: 'grass', power: 120, accuracy: 100, category: 'special' }
  ],

  electric: [
    { name: 'Thunder Shock', type: 'electric', power: 40, accuracy: 100, category: 'special' },
    { name: 'Thunderbolt', type: 'electric', power: 90, accuracy: 100, category: 'special' },
    { name: 'Thunder', type: 'electric', power: 110, accuracy: 70, category: 'special' }
  ],

  ice: [
    { name: 'Ice Punch', type: 'ice', power: 75, accuracy: 100, category: 'physical' },
    { name: 'Blizzard', type: 'ice', power: 110, accuracy: 70, category: 'special' }
  ],

  fighting: [
    { name: 'Karate Chop', type: 'fighting', power: 50, accuracy: 100, category: 'physical' },
    { name: 'Low Kick', type: 'fighting', power: 65, accuracy: 100, category: 'physical' }
  ],

  poison: [
    { name: 'Poison Sting', type: 'poison', power: 15, accuracy: 100, category: 'physical' }
  ],

  ground: [
    { name: 'Earthquake', type: 'ground', power: 100, accuracy: 100, category: 'physical' }
  ],

  flying: [
    { name: 'Wing Attack', type: 'flying', power: 60, accuracy: 100, category: 'physical' },
    { name: 'Drill Peck', type: 'flying', power: 80, accuracy: 100, category: 'physical' }
  ],

  psychic: [
    { name: 'Confusion', type: 'psychic', power: 50, accuracy: 100, category: 'special' },
    { name: 'Psychic', type: 'psychic', power: 90, accuracy: 100, category: 'special' }
  ],

  bug: [
    { name: 'String Shot', type: 'bug', power: 0, accuracy: 95, category: 'status' },
    { name: 'Leech Life', type: 'bug', power: 80, accuracy: 100, category: 'physical' }
  ],

  rock: [
    { name: 'Rock Throw', type: 'rock', power: 50, accuracy: 90, category: 'physical' }
  ],

  ghost: [
    { name: 'Lick', type: 'ghost', power: 30, accuracy: 100, category: 'physical' }
  ],

  dragon: [
    { name: 'Dragon Rage', type: 'dragon', power: 0, accuracy: 100, category: 'special' }
  ],

  dark: [
    { name: 'Bite', type: 'dark', power: 60, accuracy: 100, category: 'physical' }
  ],

  steel: [
    { name: 'Metal Claw', type: 'steel', power: 50, accuracy: 95, category: 'physical' }
  ],

  fairy: [
    { name: 'Fairy Wind', type: 'fairy', power: 40, accuracy: 100, category: 'special' }
  ]
};

export function getRandomAttacksForPokemon(pokemon: any, count: number = 4): PokemonAttack[] {
  const availableAttacks: PokemonAttack[] = [];
  
  if (pokemon.types) {
    for (const type of pokemon.types) {
      const typeAttacks = POKEMON_ATTACKS[type.type.name] || [];
      availableAttacks.push(...typeAttacks);
    }
  }
  
  availableAttacks.push(...POKEMON_ATTACKS['normal']);
  
  const shuffled = availableAttacks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}