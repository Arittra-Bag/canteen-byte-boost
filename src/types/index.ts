
// User related types
export type UserRole = 'student' | 'canteen_manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImg?: string;
}

// Nutrition related types
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isVeg: boolean;
}

// Menu related types
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

// Canteen related types
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

// Cart related types
export interface CartItem {
  menuItemId: string;
  quantity: number;
  menuItem: MenuItem;
}

// Order related types
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderFilter = OrderStatus | 'all';

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
  status: OrderStatus;
  placedAt: string;
  pickupTime?: string;
}
