// Application types that map to our Supabase schema

export type Canteen = {
  id: string;
  name: string;
  location: string;
  image?: string;
  openingTime: string; // Format: HH:MM
  closingTime: string; // Format: HH:MM
  rating: number;
  cuisine: string[];
};

export type NutritionInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isVeg: boolean;
};

export type MenuItem = {
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
};

export type OrderItem = {
  menuItemId: string;
  quantity: number;
  price: number;
};

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  canteenId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  placedAt: string; // ISO date string
  pickupTime?: string; // ISO date string
};

export type NutritionLog = {
  id: string;
  userId: string;
  date: string; // ISO date string
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

export type NutritionRecommendation = {
  id: string;
  userId: string;
  recommendation: string;
  type: string;
  createdAt: string; // ISO date string
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'canteen_manager' | 'admin';
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
};