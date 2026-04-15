/**
 * Mock data for SnackService.
 * ⚠️ Used only when environment.mock.enabled === true.
 */

import { type Snack } from '../models/snack.model';

export const MOCK_SNACKS: Snack[] = [
  // Popcorn
  {
    id: 'sn-1',
    name: 'Canchita Clásica',
    description: 'Canchita salada con mantequilla, recién hecha.',
    category: 'popcorn',
    price: 12,
    image: null,
    status: 'active',
    options: [{ label: 'Tamaño', choices: ['Pequeño', 'Mediano', 'Grande'] }],
  },
  {
    id: 'sn-2',
    name: 'Canchita Caramelizada',
    description: 'Canchita dulce con caramelo dorado.',
    category: 'popcorn',
    price: 14,
    image: null,
    status: 'active',
    options: [{ label: 'Tamaño', choices: ['Mediano', 'Grande'] }],
  },
  // Drinks
  {
    id: 'sn-3',
    name: 'Gaseosa',
    description: 'Coca-Cola, Inca Kola, Sprite o Fanta.',
    category: 'drinks',
    price: 10,
    image: null,
    status: 'active',
    options: [
      { label: 'Sabor', choices: ['Coca-Cola', 'Inca Kola', 'Sprite', 'Fanta'] },
      { label: 'Tamaño', choices: ['Mediano', 'Grande'] },
    ],
  },
  {
    id: 'sn-4',
    name: 'Agua mineral',
    description: 'Agua sin gas 500 ml.',
    category: 'drinks',
    price: 6,
    image: null,
    status: 'active',
  },
  {
    id: 'sn-5',
    name: 'Cerveza',
    description: 'Cerveza fría 355 ml.',
    category: 'drinks',
    price: 15,
    image: null,
    status: 'active',
  },
  // Combos
  {
    id: 'sn-6',
    name: 'Combo Dúo',
    description: 'Canchita mediana + 2 gaseosas medianas.',
    category: 'combos',
    price: 28,
    image: null,
    status: 'active',
  },
  {
    id: 'sn-7',
    name: 'Combo Familiar',
    description: 'Canchita grande + 4 gaseosas medianas.',
    category: 'combos',
    price: 52,
    image: null,
    status: 'active',
  },
  // Sweets
  {
    id: 'sn-8',
    name: 'Chocolates Surtidos',
    description: 'Selección de chocolates variados 150 g.',
    category: 'sweets',
    price: 16,
    image: null,
    status: 'active',
  },
  {
    id: 'sn-9',
    name: 'Gomitas',
    description: 'Bolsa de gomitas de frutas 100 g.',
    category: 'sweets',
    price: 8,
    image: null,
    status: 'active',
  },
  // Extras
  {
    id: 'sn-10',
    name: 'Nachos con salsa',
    description: 'Nachos crujientes con salsa cheddar.',
    category: 'extras',
    price: 18,
    image: null,
    status: 'active',
  },
  {
    id: 'sn-11',
    name: 'Hot dog',
    description: 'Salchicha con pan y mostaza.',
    category: 'extras',
    price: 14,
    image: null,
    status: 'active',
  },
];
