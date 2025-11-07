/**
 * Icons for the memory game
 * Using lucide-react icons
 */

import {
  Heart,
  Star,
  Zap,
  Moon,
  Sun,
  Music,
  Camera,
  Gamepad2,
  Car,
  Plane,
  Ship,
  Bike,
  Coffee,
  Pizza,
  Cake,
  IceCream,
  Apple,
  Home,
  Leaf,
  Flower,
  Mountain,
  Umbrella,
  Gift,
  Book,
  Lightbulb,
  Palette,
  Scissors,
  Wrench,
  Key,
  Lock,
  Bell,
  Mail,
  Phone,
  Globe,
  Map,
  Compass,
  Flag,
  Crown,
  Trophy,
  Target,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface IconInfo {
  name: string;
  component: LucideIcon;
}

export const gameIcons: IconInfo[] = [
  { name: 'heart', component: Heart },
  { name: 'star', component: Star },
  { name: 'zap', component: Zap },
  { name: 'moon', component: Moon },
  { name: 'sun', component: Sun },
  { name: 'music', component: Music },
  { name: 'camera', component: Camera },
  { name: 'gamepad', component: Gamepad2 },
  { name: 'car', component: Car },
  { name: 'plane', component: Plane },
  { name: 'ship', component: Ship },
  { name: 'bike', component: Bike },
  { name: 'coffee', component: Coffee },
  { name: 'pizza', component: Pizza },
  { name: 'cake', component: Cake },
  { name: 'icecream', component: IceCream },
  { name: 'apple', component: Apple },
  { name: 'home', component: Home },
  { name: 'leaf', component: Leaf },
  { name: 'flower', component: Flower },
  { name: 'mountain', component: Mountain },
  { name: 'umbrella', component: Umbrella },
  { name: 'gift', component: Gift },
  { name: 'book', component: Book },
  { name: 'lightbulb', component: Lightbulb },
  { name: 'palette', component: Palette },
  { name: 'scissors', component: Scissors },
  { name: 'wrench', component: Wrench },
  { name: 'key', component: Key },
  { name: 'lock', component: Lock },
  { name: 'bell', component: Bell },
  { name: 'mail', component: Mail },
  { name: 'phone', component: Phone },
  { name: 'globe', component: Globe },
  { name: 'map', component: Map },
  { name: 'compass', component: Compass },
  { name: 'flag', component: Flag },
  { name: 'crown', component: Crown },
  { name: 'trophy', component: Trophy },
  { name: 'target', component: Target },
];

/**
 * Get icon component by name
 */
export function getIconByName(name: string): LucideIcon | undefined {
  return gameIcons.find((icon) => icon.name === name)?.component;
}

