
export type UserRole = 'student' | 'canteen_manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImg?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isVeg: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  canteenId: string;
  category: string;
  nutrition: NutritionInfo;
  available: boolean;
  popular?: boolean;
}

export interface Canteen {
  id: string;
  name: string;
  location: string;
  image?: string;
  openingTime: string;
  closingTime: string;
  rating: number;
  cuisine: string[];
}

export interface CartItem {
  menuItemId: string;
  quantity: number;
  menuItem: MenuItem;
}

export interface Order {
  id: string;
  userId: string;
  canteenId: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  placedAt: string;
  pickupTime?: string;
}
