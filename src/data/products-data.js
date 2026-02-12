import classicBubbleTeaImg from '../assets/classic-bubble-tea.png';
import matchaTeaImg from '../assets/matcha-tea.png';
import taroTeaImg from '../assets/taro-tea.png';
import mangoTeaImg from '../assets/mango-tea.png';
import strawberryTeaImg from '../assets/strawberry-tea.png';
import peachTeaImg from '../assets/peach-tea.png';
import jasmineMilkTeaImg from '../assets/jasmine-milk-tea.png';
import oreoBubbleImg from '../assets/oreo-bubble.png';

export const bobaProducts = [
  {
    id: 1,
    name: 'Classic Bubbly',
    price: '3.50€',
    img: classicBubbleTeaImg,
    description: 'Black tea, brown sugar and milk.',
    category: 'classics',
  },
  {
    id: 2,
    name: 'Matcha',
    price: '3.90€',
    img: matchaTeaImg,
    description: 'High-quality green matcha tea with creamy milk.',
    category: 'classics',
  },
  {
    id: 3,
    name: 'Taro Dream',
    price: '3.50€',
    img: taroTeaImg,
    description: 'Natural sweet taro tea.',
    category: 'classics',
  },
  {
    id: 4,
    name: 'Mango Loco',
    price: '3.80€',
    img: mangoTeaImg,
    description: 'Tropical mango.',
    category: 'fruit',
  },
  {
    id: 5,
    name: 'Strawberryness',
    price: '4.20€',
    img: strawberryTeaImg,
    description: 'Fresh strawberries and whipped cream.',
    category: 'fruit',
  },
  {
    id: 6,
    name: 'Peachy',
    price: '3.60€',
    img: peachTeaImg,
    description: 'Black tea with natural peach.',
    category: 'teas',
  },
  {
    id: 7,
    name: 'Jazzy',
    price: '3.70€',
    img: jasmineMilkTeaImg,
    description: 'Jasmine tea with milk.',
    category: 'teas',
  },
  {
    id: 8,
    name: 'Oreo Bubble',
    price: '4.50€',
    img: oreoBubbleImg,
    description: 'Oreo cream with cookie pieces.',
    category: 'specials',
  },
];

export const categories = [
  { id: 'classics', label: 'Classics' },
  { id: 'fruit', label: 'Fruit' },
  { id: 'teas', label: 'Teas' },
  { id: 'specials', label: 'Specials' },
];
